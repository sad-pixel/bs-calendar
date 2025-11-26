# IITM BS Calendar Aggregator

This is a small application that scrapes course calendar feeds from Google Calendar, and aggregates them in a single place.

## How it works

1. It reads the list of available calendars from `calendars.csv`
2. For each available calendar, it decodes the Google Calendar URL and downloads the ICalendar feed
3. An API service parses the downloaded ICal feeds and returns events from it

## Motivation
The IITM BS program has multiple courses, each with their own Google Calendar. It quickly becomes cumbersome to manage all these separate calendars: finding the URLs, adding them manually to your personal calendar, removing them when the term ends etc.

This application aims to simplify this process by aggregating all course calendars in one place. Users can select which courses they're enrolled in and view all their academic events in a unified interface.

Future plans include developing a user authentication system so students can log in once, select their courses, and have everything automatically sync with their personal Google Calendar. This will eliminate the need to manually manage multiple calendar subscriptions and ensure students always have the most up-to-date schedule information.

## Setup Instructions

```bash
uv sync
uv run sync.py # for downloading the calendars
uv run api.py # start the API server
```

## API Endpoints

### GET /courses

Returns a list of available courses with their details.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Course Name",
    "google_calendar_link": "https://calendar.google.com/...",
    "is_synced": true
  }
]
```

### GET /events

Returns a list of calendar events filtered by course IDs and date range.

**Query Parameters:**
- `cid`: List of course IDs (up to 10)
- `start_at`: Start date in ISO format (YYYY-MM-DD)
- `end_at`: End date in ISO format (YYYY-MM-DD)

**Note:** The date range must be less than 400 days.

**Response:**
```json
[
  {
    "id": "event_unique_id",
    "title": "Event Title",
    "description": "Event Description",
    "calendar_id": 1,
    "start_at": "2023-01-01T10:00:00",
    "end_at": "2023-01-01T11:00:00"
  }
]
```

### GET /export.ics

Exports selected calendars as a single ICalendar file that can be imported into calendar applications.

**Query Parameters:**
- `cid`: List of course IDs to include
- `name`: Optional name for the exported calendar (default: "Exported Calendar")

**Response:**
A downloadable .ics file containing all events from the selected courses.

**Example:**
```
/export.ics?cid=1&cid=2&name=My%20IITM%20Calendar
```

## License

MIT

Copyright 2025 Ishan Das Sharma

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
