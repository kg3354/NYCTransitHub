from flask import Flask, jsonify, render_template
import requests


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
@app.route('/fetch-alerts')
def fetch_alerts():
    # The API link for the MTA GTFS Alerts Feed
    feed_url = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fall-alerts"
    response = requests.get(feed_url)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch the GTFS alerts feed"}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
