
import requests
import json

# Making a GET request to retrieve location
response = requests.get('http://ipinfo.io/loc')
if response.status_code == 200:
    location = response.text.strip().split(',')
    latitude, longitude = location[0], location[1]

    # Preparing parameters for the weather API call
    params = {
        'lat': latitude,
        'lon': longitude,
        'appid': '35ef5871b2c5686f4956864d3a0c9a9e'
    }

    # Making a GET request to retrieve weather
    weather_response = requests.get('https://api.openweathermap.org/data/2.5/weather', params=params)
    if weather_response.status_code == 200:
        print(json.dumps(weather_response.json()))  # Only output the final JSON data
