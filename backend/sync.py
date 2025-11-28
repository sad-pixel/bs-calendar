from base64 import b64decode
from datetime import datetime
from urllib.parse import parse_qs, urlparse

import requests

from db.connection import engine
from db.queries import Querier


def decode_cid(link):
    parsed = urlparse(link)
    encoded_cid = parse_qs(parsed.query)["cid"][0]
    decoded_cid = b64decode(encoded_cid + "==").decode("utf-8")
    return decoded_cid


def get_ical_link(link):
    return f"https://calendar.google.com/calendar/ical/{link}/public/basic.ics"


def process_calendars(output_dir="cals"):
    with engine.begin() as conn:
        querier = Querier(conn)
        for calendar in querier.get_all_course_calendars():
            cal_id = calendar.id
            calendar_url = calendar.calendar_url
            try:
                decoded_cid = decode_cid(calendar_url)
                ical_link = get_ical_link(decoded_cid)

                response = requests.get(ical_link)
                response.raise_for_status()  # Raise an exception for 4XX/5XX responses
                calendar_data = response.text

                querier.update_course_i_cal(course_id=cal_id, ics_string=calendar_data)

                # Update the database with the sync status
                querier.update_calendar_sync_status(
                    last_sync_at=datetime.now().isoformat(),
                    last_sync_http_status=response.status_code,
                    id=cal_id,
                )

                print(f"Downloaded calendar for course ID: {cal_id}")
            except requests.exceptions.HTTPError as e:
                # Update the database with error status
                last_status = (
                    e.response.status_code
                    if hasattr(e, "response") and e.response
                    else 999
                )
                print(f"Error processing calendar for course ID {cal_id}: {str(e)}")
                querier.update_calendar_sync_status(
                    last_sync_at=datetime.now().isoformat(),
                    last_sync_http_status=last_status,
                    id=cal_id,
                )
            except Exception as e:
                # Update the database with error status for non-request exceptions
                print(
                    f"Unknown error processing calendar for course ID {cal_id}: {str(e)}"
                )
                querier.update_calendar_sync_status(
                    last_sync_at=datetime.now().isoformat(),
                    last_sync_http_status=999,
                    id=cal_id,
                )


if __name__ == "__main__":
    process_calendars()
