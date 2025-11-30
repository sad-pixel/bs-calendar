import base64
import datetime
import hashlib
import json
import os
from typing import Annotated, List, Optional
from urllib.parse import urlencode

import icalendar
import recurring_ical_events
import requests as r
import uvicorn
from fastapi import Depends, FastAPI, Query, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware

from config import settings
from db.connection import get_querier
from db.queries import Querier
from middleware import FixListQueryParamsMiddleware

app = FastAPI(
    title="BS Calendar",
    description="Calendar aggregator for IITM BS Degree",
    version="1.0.0",
)

origins = ["http://localhost", "http://localhost:5173", "http://localhost:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(FixListQueryParamsMiddleware)
app.add_middleware(SessionMiddleware, same_site="none", secret_key=settings.secret_key)


@app.get("/api/me")
def get_me(request: Request):
    return {"user_id": request.session.get("user_id", None)}


class Course(BaseModel):
    id: str
    name: str
    level: str
    calendar_available: bool
    last_sync_at: Optional[datetime.datetime]


@app.get("/api/courses", response_model=List[Course])
def get_courses(querier: Querier = Depends(get_querier)):
    return querier.get_courses_list()


class EventFilter(BaseModel):
    cid: List[str]
    start_at: datetime.date
    end_at: datetime.date

    @classmethod
    def validate_date_range(cls, v):
        if (v.end_at - v.start_at).days > 400:
            raise RequestValidationError(
                "start_at and end_at must be less than 400 days apart"
            )
        return v

    @classmethod
    def validate_cid(cls, v):
        if len(v.cid) > 10:
            raise RequestValidationError("cid must have fewer than or exactly 10 items")
        return v

    def __init__(self, **data):
        super().__init__(**data)
        self.validate_date_range(self)
        self.validate_cid(self)


class Event(BaseModel):
    id: str
    title: str
    description: Optional[str]
    calendar_id: str
    start_at: datetime.datetime
    end_at: Optional[datetime.datetime]


def fetch_calendar(querier: Querier, course_id: str):
    feed_data = querier.get_course_i_cal(course_id=course_id)
    if not feed_data:
        return None

    return icalendar.Calendar.from_ical(feed_data)


@app.get("/api/events", response_model=List[Event])
def get_events(
    filter_params: Annotated[EventFilter, Query()],
    querier: Querier = Depends(get_querier),
):
    all_events = []
    for calendar_id in filter_params.cid:
        ical_feed = fetch_calendar(querier, calendar_id)
        if not ical_feed:
            continue

        events = [
            {
                "title": e.get("SUMMARY"),
                "start_at": e.get("DTSTART").dt,
                "end_at": e.get("DTEND").dt,
                "description": e.get("DESCRIPTION"),
                "id": e.get("UID"),
                "calendar_id": calendar_id,
            }
            for e in recurring_ical_events.of(
                ical_feed, keep_recurrence_attributes=True
            ).between(filter_params.start_at, filter_params.end_at)
        ]
        all_events = all_events + events
    # Sort all events by start_at before returning
    return sorted(all_events, key=lambda event: event["start_at"])


class ExportFilter(BaseModel):
    cid: List[str]
    name: str = "Exported Calendar"


@app.get("/api/export.ics", response_class=Response)
def export_calendar(
    filter_params: Annotated[ExportFilter, Query()],
    querier: Querier = Depends(get_querier),
):
    cal = icalendar.Calendar()
    cal["PRODID"] = "BSCalendar v1.0"
    cal["X-WR-CALNAME"] = filter_params.name
    cal["X-WR-TIMEZONE"] = "Asia/Kolkata"
    cal.calendar_name = filter_params.name

    for calendar_id in filter_params.cid:
        ical_feed = fetch_calendar(querier, calendar_id)
        if not ical_feed:
            continue

        for event in ical_feed.events:  # pyright: ignore[reportAttributeAccessIssue]
            cal.add_component(event)

    return Response(cal.to_ical(), media_type="text/calendar")


@app.get("/api/auth-login")
def google_auth_login(request: Request):
    """
    Returns the URL to redirect users to for Google OAuth login
    Implements PKCE flow for added security
    """
    # Generate code verifier (random string between 43-128 chars)
    code_verifier = base64.urlsafe_b64encode(os.urandom(40)).decode("utf-8")
    code_verifier = code_verifier.replace("=", "")  # Remove padding

    # Generate code challenge from verifier using SHA256
    code_challenge = hashlib.sha256(code_verifier.encode("utf-8")).digest()
    code_challenge = base64.urlsafe_b64encode(code_challenge).decode("utf-8")
    code_challenge = code_challenge.replace("=", "")  # Remove padding

    state = base64.urlsafe_b64encode(
        json.dumps({"code_verifier": code_verifier}).encode()
    ).decode("utf-8")
    request.session["oauth_state"] = state

    # Build OAuth URL with PKCE parameters
    params = {
        "client_id": settings.google_client_id,
        "response_type": "code",
        "scope": "openid email profile",
        "redirect_uri": settings.google_redirect_url,
        "prompt": "select_account",
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
    }

    google_oauth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    )

    return RedirectResponse(url=google_oauth_url)


@app.get("/api/auth-redirect")
async def google_auth_redirect(
    request: Request, code: str, querier: Querier = Depends(get_querier)
):
    """
    Handles the redirect from Google OAuth
    Exchanges authorization code for tokens using PKCE
    """
    # Extract code_verifier from state
    try:
        state = request.session.get("oauth_state", "")
        decoded_state = json.loads(base64.urlsafe_b64decode(state).decode("utf-8"))
        code_verifier = decoded_state.get("code_verifier")
        del request.session["oauth_state"]
    except:
        return {"error": "Invalid state parameter"}

    # Exchange authorization code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "client_id": settings.google_client_id,
        "client_secret": settings.google_client_secret,
        "code": code,
        "code_verifier": code_verifier,
        "grant_type": "authorization_code",
        "redirect_uri": settings.google_redirect_url,
    }

    response = r.post(token_url, data=token_data)
    token_response = response.json()

    if "error" in token_response:
        return {"error": token_response.get("error")}

    # Get user info using the ID token
    id_token_value = token_response.get("id_token")
    user_data = id_token.verify_oauth2_token(
        id_token_value, requests.Request(), settings.google_client_id
    )

    request.session["user_id"] = user_data.get("email", None)
    querier.login_user(
        first_name=user_data.get("given_name"),
        last_name=user_data.get("family_name"),
        email=user_data.get("email"),
    )

    # Return user info as JSON
    return user_data


if __name__ == "__main__":
    uvicorn.run("api:app", host=settings.host, port=settings.port, reload=True)
