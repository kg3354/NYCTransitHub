import requests

# The API link for the MTA GTFS Alerts Feed
feed_url = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fall-alerts"

response = requests.get(feed_url)

if response.status_code == 200:
    alerts_data = response.json()
    # Assuming the feed follows a standard GTFS structure, let's print the header text of each alert
    for entity in alerts_data.get("entity", []):
        alert = entity.get("alert")
        if alert:
            # Adjusting to handle possibly different JSON structure based on actual API response
            header_text = alert.get("headerText", {}).get("translation", [{}])[0].get("text")
            print(header_text)
else:
    print("Failed to fetch the GTFS alerts feed:", response.status_code)
