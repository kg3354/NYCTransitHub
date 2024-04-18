from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from nyct_gtfs import NYCTFeed
import datetime
import threading
import time

app = Flask(__name__)
socketio = SocketIO(app)

# Function to fetch and emit live transit updates
def fetch_and_emit_updates():
    while True:
        try:
            # Fetch live transit updates
            feed = NYCTFeed("B", api_key="https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace")
            train = feed.trips[0]
            direction = train.direction
            last_update_time = train.last_position_update.strftime("%Y-%m-%d %H:%M:%S")

            # Emit the updates to connected clients
            socketio.emit('transit_update', {
                'direction': direction,
                'last_update_time': last_update_time
            })

            # Sleep for a few seconds before fetching updates again
            time.sleep(10)
        except Exception as e:
            print("Error fetching and emitting updates:", e)

# Route to render the main page
@app.route('/')
def index():
    return render_template('index.html')

# WebSocket event handler to handle client connections
@socketio.on('connect')
def handle_connect():
    print("Client connected")

# Start the background thread to fetch and emit live transit updates
background_thread = threading.Thread(target=fetch_and_emit_updates)
background_thread.daemon = True
background_thread.start()

if __name__ == '__main__':
    socketio.run(app)
