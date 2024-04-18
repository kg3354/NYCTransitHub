from nyct_gtfs import NYCTFeed
import datetime

# Get All Trip Data from the Feed
feed = NYCTFeed("B", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")
trains = feed.trips
print(len(trains))

# Filter Only Certain Trip Data from the Feed
feed = NYCTFeed("B", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")
trains_D = feed.filter_trips(line_id="D")
print(len(trains_D))

trains_DM = feed.filter_trips(line_id=["D", "M"])
print(len(trains_DM))

# Read Trip/Train Metadata
feed = NYCTFeed("N", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")
train = feed.trips[0]
print(str(train))

print(train.direction)
print(train.route_id)
print(train.headsign_text)
print(train.departure_time)
print(train.location)
print(train.location_status)
print(train.last_position_update)

# Read Remaining Stops
train = feed.trips[0]
print(str(train))
print(train.stop_time_updates[0].stop_name)
print(len(train.stop_time_updates))
print(train.stop_time_updates[-1].stop_name)

# Read Remaining Stops
train = feed.trips[0]
print(str(train))
if len(train.stop_time_updates) > 0:
    print(train.stop_time_updates[0].stop_name)
    print(len(train.stop_time_updates))
    print(train.stop_time_updates[-1].stop_name)
else:
    print("No stop time updates available for this train.")


# Read Feed Metadata
feed = NYCTFeed("A", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")
print(feed.last_generated)
print(feed.gtfs_realtime_version)
print(feed.nyct_subway_gtfs_version)
print(feed.trip_replacement_periods)
print(feed.trip_replacement_periods.keys())

# Refresh Feed Data
feed = NYCTFeed("A", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")
train = feed.trips[0]
print(train.direction)

feed.refresh()

train = feed.trips[0]
print(train.direction)
