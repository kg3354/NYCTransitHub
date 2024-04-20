import os
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

def get_location():
    try:
        response = requests.get('http://ipinfo.io/loc')
        print("HTTP Response:", response)

        if response.status_code == 200:
            location = response.text.strip().split(',')
            latitude, longitude = location[0], location[1]
            print("Location: Latitude =", latitude, ", Longitude =", longitude)
        else:
            print("Failed to retrieve location")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching location: {e}")

def load_stops():
    stops = {}
    try:
        with open("google_transit/stops.txt", "r") as stops_info:
            print("Reading stops.txt file...")
            next(stops_info) 
            for line in stops_info:
                data = line.strip().split(",")
                if len(data) >= 6:
                    stop_id = data[0].strip()
                    stops[stop_id] = {
                        'name': data[1].strip(),
                        'lat': data[2].strip(),
                        'lon': data[3].strip()
                    }
        print(f"Loaded {len(stops)} stops.")
        print(list(stops.items())[:5]) 
    except FileNotFoundError:
        print("Failed to open 'stops.txt'.")
    except Exception as e:
        print(f"Error reading 'stops.txt': {e}")
    return stops

def load_arrivals():
    arrivals = {}
    try:
        with open("google_transit/stop_times.txt", "r") as stop_times:
            print("Reading stop_times.txt file...")
            next(stop_times)  
            for line in stop_times:
                data = line.strip().split(",")
                if len(data) > 3:
                    time = data[1].strip()
                    stop_id = data[3].strip()
                    arrivals.setdefault(stop_id, []).append(time)
        print(f"Loaded arrivals for {len(arrivals)} stops.")
        print(list(arrivals.items())[:5])  
    except FileNotFoundError:
        print("Failed to open 'stop_times.txt'.")
    except Exception as e:
        print(f"Error reading 'stop_times.txt': {e}")
    return arrivals

@app.route('/')
def index():
    return 'hello world. stations'

@app.route('/stations')
def stations():
    stops = load_stops()
    arrivals = load_arrivals()
    data = {}
    for stop_id in stops:
        if stop_id in arrivals:
            data[stop_id] = {
                'name': stops[stop_id]['name'],
                'lat': stops[stop_id]['lat'],
                'lon': stops[stop_id]['lon'],
                'arrivals': arrivals[stop_id]
            }
    # print(f"Combined data for {len(data)} stops.")
    stations_list = [{'id': id, 'name': data[id]['name']} for id in data]
    response = jsonify(result=stations_list)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

if __name__ == "__main__":
    get_location() 
    app.run(debug=True)