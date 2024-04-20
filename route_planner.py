from nyct_gtfs import NYCTFeed
import datetime

def find_next_departure(station, line):
    try:
        # Initialize NYCTFeed with the appropriate line
        feed = NYCTFeed(line, api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")

        # Get the current time
        current_time = datetime.datetime.now()

        # Find the next departure from the specified station
        for trip in feed.trips:
            if trip.location_status == station:
                if len(trip.stop_time_updates) > 0:
                    departure_time = datetime.datetime.fromtimestamp(trip.stop_time_updates[0].departure_time)
                    if departure_time > current_time:
                        return departure_time.strftime("%H:%M"), trip.headsign_text

        return "No upcoming departures found.", None

    except Exception as e:
        return f"Error: {str(e)}", None

# Example usage:
station = "Times Sq - 42 St"
line = "7"
departure_time, destination = find_next_departure(station, line)
print(f"Next departure from {station} on the {line} line is at {departure_time} heading to {destination}.")
