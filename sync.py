import csv
import os
from base64 import b64decode
from urllib.parse import parse_qs, urlparse

import requests


def decode_cid(link):
    parsed = urlparse(link)
    encoded_cid = parse_qs(parsed.query)["cid"][0]
    decoded_cid = b64decode(encoded_cid + "==").decode("utf-8")
    return decoded_cid


def get_ical_link(link):
    return f"https://calendar.google.com/calendar/ical/{link}/public/basic.ics"


def process_calendars_file(file_path="calendars.csv", output_dir="cals"):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(file_path, "r") as csvfile:
        reader = csv.reader(csvfile)
        next(reader, None)

        for row in reader:
            cal_id, name, link = row
            try:
                decoded_cid = decode_cid(link)
                ical_link = get_ical_link(decoded_cid)

                response = requests.get(ical_link)
                response.raise_for_status()  # Raise an exception for 4XX/5XX responses
                calendar_data = response.text

                output_path = os.path.join(output_dir, f"{cal_id}.ics")
                with open(output_path, "w") as f:
                    f.write(calendar_data)

                print(f"Downloaded calendar: {name} (ID: {cal_id})")
            except Exception as e:
                print(f"Error processing calendar {name} (ID: {cal_id}): {str(e)}")


if __name__ == "__main__":
    process_calendars_file()
