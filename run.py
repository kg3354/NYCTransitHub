from nyct_gtfs import NYCTFeed

# Load the realtime feed from the MTA site
feed = NYCTFeed("1", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")

trains = feed.trips

print(len(trains))