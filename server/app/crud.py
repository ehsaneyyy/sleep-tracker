from sqlalchemy.orm import Session
from . import models, schemas


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
