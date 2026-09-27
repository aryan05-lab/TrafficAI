from flask import Flask, render_template, jsonify, request
from pathlib import Path
import random
from ai.model import classify
from ai.decision_agent import decide

BASE = Path(__file__).resolve().parent
app = Flask(__name__)

@app.get('/')
def home():
    return render_template('dashboard.html')

@app.post('/api/analyze')
def analyze():
    data = request.get_json(silent=True) or {}
    location = str(data.get('location', 'Mumbai'))
    vehicles = int(float(data.get('vehicles', 1284)))
    speed = float(data.get('speed', 24))
    emergency = bool(data.get('emergency', False))
    occupancy = max(5, min(100, round(vehicles / 22)))
    congestion, confidence = classify(vehicles, speed, occupancy)
    result = decide(congestion, vehicles, speed, emergency)
    return jsonify({
        'location': location,
        'vehicles': vehicles,
        'speed': round(speed, 1),
        'occupancy': occupancy,
        'congestion': congestion,
        'confidence': confidence,
        **result
    })

@app.get('/api/live')
def live():
    vehicles = random.randint(650, 1900)
    speed = round(random.uniform(15, 48), 1)
    occupancy = max(5, min(100, round(vehicles / 22)))
    congestion, confidence = classify(vehicles, speed, occupancy)
    return jsonify({
        'location': 'Mumbai',
        'vehicles': vehicles,
        'speed': speed,
        'occupancy': occupancy,
        'congestion': congestion,
        'confidence': confidence
    })

@app.get('/api/health')
def health():
    return jsonify({'status': 'ok', 'service': 'TrafficAI', 'version': '1.0'})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)
