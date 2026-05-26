from datetime import datetime, timedelta

NIGHT_START_HOUR = 22  
NIGHT_END_HOUR = 8  
MIN_SLEEP_HOURS = 3 


def is_night(timestamp: datetime) -> bool:
    hour = timestamp.hour
    return hour >= NIGHT_START_HOUR or hour < NIGHT_END_HOUR


def detect_sleep_window(events):
    sleep_start = None
    sleep_end = None
    for ev in events:
        if ev.event_type == "idle" and sleep_start is None:
            if is_night(ev.timestamp):
                sleep_start = ev.timestamp
        elif ev.event_type == "active" and sleep_start is not None:
            if is_night(ev.timestamp):
                sleep_end = ev.timestamp
                duration = (sleep_end - sleep_start).total_seconds() / 3600
                if duration >= MIN_SLEEP_HOURS:
                    return sleep_start, sleep_end, duration
                sleep_start = None
                sleep_end = None
    return None, None, None
