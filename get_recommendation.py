import sys
import json
import requests
from nyct_gtfs import NYCTFeed

def get_api_key(route_id):
    # Mapping of routes to their corresponding API endpoints
    api_keys = {
        'ACE': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace',
        'BDFM': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm',
        'G': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g',
        'JZ': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz',
        'NQRW': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw',
        'L': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l',
        '1234567': 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs'
    }
    group_keys = {
        'A': 'ACE', 'C': 'ACE', 'E': 'ACE',
        'B': 'BDFM', 'D': 'BDFM', 'F': 'BDFM', 'M': 'BDFM',
        'G': 'G',
        'J': 'JZ', 'Z': 'JZ',
        'N': 'NQRW', 'Q': 'NQRW', 'R': 'NQRW', 'W': 'NQRW',
        'L': 'L',
        '1': '1234567', '2': '1234567', '3': '1234567',
        '4': '1234567', '5': '1234567', '6': '1234567', '7': '1234567'
    }
    group = group_keys.get(route_id.upper(), None)
    return api_keys.get(group, None)

def get_current_location():
    try:
        response = requests.get('http://ipinfo.io/loc')
        if response.status_code == 200:
            location = response.text.strip().split(',')
            latitude, longitude = location[0], location[1]
            return latitude, longitude
        else:
            return None, None
    except requests.exceptions.RequestException as e:
        return None, None

def get_trip_details(trip):
    return {
        "Route ID": trip.route_id,
        "Direction": trip.direction,
        "Headsign": trip.headsign_text,
        "Departure Time": str(trip.departure_time),
        "Current Location": trip.location,
        "Location Status": trip.location_status,
        "Last Position Update": trip.last_position_update.strftime("%Y-%m-%d %H:%M:%S") if trip.last_position_update else "N/A"
    }

def get_stops_details(trip):
    if trip.stop_time_updates:
        return {
            "First Stop": trip.stop_time_updates[0].stop_name,
            "Last Stop": trip.stop_time_updates[-1].stop_name,
            "Total Stops": len(trip.stop_time_updates)
        }
    else:
        return {"Error": "No stop time updates available for this train."}

def main(route_id, direction):
    api_key = get_api_key(route_id)
    if not api_key:
        return json.dumps({"Error": "Invalid route ID or API key not found."})

    feed = NYCTFeed(route_id.upper(), api_key=api_key)

    current_latitude, current_longitude = get_current_location()
    location_info = {
        "Current Latitude": current_latitude,
        "Current Longitude": current_longitude
    }

    # Filter trips for the exact route_id and direction requested
    trips = [trip for trip in feed.trips if trip.route_id == route_id.upper() and trip.direction == direction.upper()]

    if trips:
        train = trips[0]  # Get the first relevant trip
        trip_details = get_trip_details(train)
        stops_details = get_stops_details(train)
        feed.refresh()
        result = {
            "Location Info": location_info,
            "Trip Details": trip_details,
            "Stops Details": stops_details
        }
        return json.dumps(result)
    else:
        return json.dumps({"Error": "No trips available for the specified route and direction."})

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(json.dumps({"Error": "Usage: python get_recommendation.py <Route ID> <Direction>"}))
    else:
        route_id = sys.argv[1]
        direction = sys.argv[2]
        print(main(route_id, direction))
