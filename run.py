from nyct_gtfs import NYCTFeed

feed = NYCTFeed("1", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")

trains = feed.trips

print(len(trains))