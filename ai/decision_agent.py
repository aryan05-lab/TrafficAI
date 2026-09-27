def decide(congestion, vehicles, speed, emergency=False):
    if emergency:
        return {
            'priority': True,
            'decision': 'Activate emergency priority corridor',
            'action': 'Preemptive signal timing',
            'green_time': 60,
            'target': 'Clear route for emergency vehicle'
        }
    if congestion == 'HEAVY':
        return {
            'priority': False,
            'decision': 'Extend green phase for busy approach',
            'action': 'Adaptive signal timing',
            'green_time': 60,
            'target': 'Reduce queue length and congestion'
        }
    if congestion == 'MODERATE':
        return {
            'priority': False,
            'decision': 'Extend green phase for busy approach',
            'action': 'Adaptive signal timing',
            'green_time': 45,
            'target': 'Improve flow and reduce queue length'
        }
    return {
        'priority': False,
        'decision': 'Maintain balanced phase timing',
        'action': 'Normal adaptive timing',
        'green_time': 30,
        'target': 'Maintain smooth traffic flow'
    }
