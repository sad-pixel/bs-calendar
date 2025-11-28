import datetime
from typing import Annotated, List, Optional

import icalendar
import recurring_ical_events
import uvicorn
from fastapi import Depends, FastAPI, Query, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
    return all_events


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


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
