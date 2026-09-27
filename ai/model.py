def classify(vehicles, speed, occupancy):
    """Lightweight traffic-state classifier used by the academic prototype.
    It deliberately avoids a heavy model dependency so the dashboard remains reliable.
    """
    if occupancy >= 75 or speed < 18 or vehicles >= 1650:
        state = 'HEAVY'
        confidence = 94
    elif occupancy >= 45 or speed < 30 or vehicles >= 1050:
        state = 'MODERATE'
        confidence = 89
    else:
        state = 'LOW'
        confidence = 92
    return state, confidence
