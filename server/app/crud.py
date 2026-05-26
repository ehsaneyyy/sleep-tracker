from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime, timedelta


def create_entry(db: Session, entry: schemas.SleepEntryCreate, user_id: int):
    db_entry = models.SleepEntry(
        date=entry.date,
        sleep_time=entry.sleep_time,
        wake_time=entry.wake_time,
        quality=entry.quality,
        notes=entry.notes,
        user_id=user_id,
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_entries(db: Session, user_id: int, days: int = 7):
    from datetime import datetime, timedelta

    since = datetime.utcnow() - timedelta(days=days)
    return (
        db.query(models.SleepEntry)
        .filter(
            models.SleepEntry.user_id == user_id,
            models.SleepEntry.date >= since,
        )
        .order_by(models.SleepEntry.date.desc())
        .all()
    )


def create_idle_event(db: Session, user_id: int, event_type: str, timestamp: datetime):
    db_event = models.IdleEvent(
        user_id=user_id,
        event_type=event_type,
        timestamp=timestamp,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_recent_idle_events(db: Session, user_id: int, hours: int = 24):
    since = datetime.utcnow() - timedelta(hours=hours)
    return (
        db.query(models.IdleEvent)
        .filter(
            models.IdleEvent.user_id == user_id,
            models.IdleEvent.timestamp >= since,
        )
        .order_by(models.IdleEvent.timestamp.asc())
        .all()
    )


def get_sleep_profile(db: Session, user_id: int):
    since = datetime.utcnow() - timedelta(days=7)
    entries = (
        db.query(models.SleepEntry)
        .filter(
            models.SleepEntry.user_id == user_id,
            models.SleepEntry.date >= since,
        )
        .all()
    )
    if not entries:
        return None
    bed_minutes = []
    wake_minutes = []
    for e in entries:
        bed_minutes.append(e.sleep_time.hour * 60 + e.sleep_time.minute)
        wake_minutes.append(e.wake_time.hour * 60 + e.wake_time.minute)
    avg_bed = sum(bed_minutes) / len(bed_minutes)
    avg_wake = sum(wake_minutes) / len(wake_minutes)
    return {
        "bed_time": f"{int(avg_bed // 60):02d}:{int(avg_bed % 60):02d}",
        "wake_time": f"{int(avg_wake // 60):02d}:{int(avg_wake % 60):02d}",
    }
