"""Optional OpenCV detector hook.
The web application does not import this module during startup, so missing OpenCV
cannot prevent the TrafficAI dashboard from running.
"""

def opencv_status():
    try:
        import cv2
        return {'available': True, 'version': cv2.__version__}
    except Exception as exc:
        return {'available': False, 'version': None, 'error': str(exc)}

def process_demo_video(input_path, output_path):
    import cv2
    cap = cv2.VideoCapture(str(input_path))
    if not cap.isOpened():
        raise RuntimeError(f'Could not open video: {input_path}')
    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 640)
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 360)
    writer = cv2.VideoWriter(str(output_path), cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        cv2.putText(frame, 'TrafficAI | VISION FEED', (18, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (80, 210, 150), 2)
        writer.write(frame)
    cap.release(); writer.release()
    return output_path
