from nyct_gtfs import NYCTFeed
import datetime

def print_trip_details(trip):
    print("Trip Details:")
    print(f"Route ID: {trip.route_id}")
    print(f"Direction: {trip.direction}")
    print(f"Headsign: {trip.headsign_text}")
    print(f"Departure Time: {trip.departure_time}")
    print(f"Current Location: {trip.location}")
    print(f"Location Status: {trip.location_status}")
    print(f"Last Position Update: {trip.last_position_update}")
    print("-" * 40)

def print_stops_details(trip):
    print("Stops Details:")
    if trip.stop_time_updates:
        print(f"First Stop: {trip.stop_time_updates[0].stop_name}")
        print(f"Last Stop: {trip.stop_time_updates[-1].stop_name}")
        print(f"Total Stops: {len(trip.stop_time_updates)}")
    else:
        print("No stop time updates available for this train.")
    print("-" * 40)

# def print_feed_metadata(feed):
#     print("Feed Metadata:")
#     print(f"Last Generated: {feed.last_generated}")
#     print(f"GTFS Realtime Version: {feed.gtfs_realtime_version}")
#     print(f"NYCT Subway GTFS Version: {feed.nyct_subway_gtfs_version}")
#     print(f"Trip Replacement Periods: {feed.trip_replacement_periods.keys()}")
#     print("-" * 40)

# Example use of defined functions
feed = NYCTFeed("N", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")
train = feed.trips[0]

print_trip_details(train)
print_stops_details(train)

# Refreshing feed data to ensure latest information
feed.refresh()
train = feed.trips[0]

print_trip_details(train)

# feed_A = NYCTFeed("A", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")
# print_feed_metadata(feed_A)

