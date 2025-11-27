import csv
import datetime
import os
from typing import Annotated, List, Optional

import icalendar
import recurring_ical_events
import uvicorn
from fastapi import FastAPI, Query, Response
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel

app = FastAPI(
    title="BS Calendar",
    description="Calendar aggregator for IITM BS Degree",
    version="1.0.0",
)


class Course(BaseModel):
    id: int
    name: str
    google_calendar_link: str
    is_synced: bool


@app.get("/courses", response_model=List[Course])
def get_courses():
    csvfile = open("calendars.csv", "r")
    reader = csv.reader(csvfile)
    next(reader, None)

    return [
        {
            "id": int(row[0]),
            "name": row[1],
            "google_calendar_link": row[2],
            "is_synced": os.path.exists(f"cals/{row[0]}.ics"),
        }
        for row in reader
    ]


class EventFilter(BaseModel):
    cid: List[int]
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
    calendar_id: int
    start_at: datetime.datetime
    end_at: Optional[datetime.datetime]


@app.get("/events", response_model=List[Event])
def get_events(filter_params: Annotated[EventFilter, Query()]):
    all_events = []
    for calendar_id in filter_params.cid:
        if not os.path.exists(f"cals/{calendar_id}.ics"):
            continue

        with open(f"cals/{calendar_id}.ics", "r") as calendar_file:
            ical_feed = icalendar.Calendar.from_ical(calendar_file.read())
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
    cid: List[int]
    name: str = "Exported Calendar"


@app.get("/export.ics", response_class=Response)
def export_calendar(filter_params: Annotated[ExportFilter, Query()]):
    cal = icalendar.Calendar()
    cal["PRODID"] = "BSCalendar v1.0"
    cal["X-WR-CALNAME"] = filter_params.name
    cal["X-WR-TIMEZONE"] = "Asia/Kolkata"
    cal.calendar_name = filter_params.name

    for calendar_id in filter_params.cid:
        if not os.path.exists(f"cals/{calendar_id}.ics"):
            continue

        with open(f"cals/{calendar_id}.ics", "r") as calendar_file:
            ical_feed = icalendar.Calendar.from_ical(calendar_file.read())
            for event in ical_feed.events:  # pyright: ignore[reportAttributeAccessIssue]
                cal.add_component(event)

    return Response(cal.to_ical(), media_type="text/calendar")


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
