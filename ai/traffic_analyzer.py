def log_event(location, vehicles, speed, occupancy, congestion):
    return {
        'location': location,
        'vehicles': vehicles,
        'speed': speed,
        'occupancy': occupancy,
        'congestion': congestion,
    }
