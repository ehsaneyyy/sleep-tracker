from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User, SleepEntry
from ..schemas import IdleEventCreate
from .. import crud, auto_sleep
from datetime import datetime

router = APIRouter(prefix="/auto", tags=["auto"])


@router.post("/detect")
def detect_offline_sleep(
    sleep_time: datetime,
    wake_time: datetime,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    duration = (wake_time - sleep_time).total_seconds() / 3600
    if duration < auto_sleep.MIN_SLEEP_HOURS:
        return {"status": "too short"}

    if not auto_sleep.is_night(sleep_time) or not auto_sleep.is_night(wake_time):
        return {"status": "not night"}

    
    existing = (
        db.query(SleepEntry)
        .filter(
            SleepEntry.user_id == current_user.id,
            SleepEntry.sleep_time == sleep_time,
        )
        .first()
    )
    if existing:
        return {"status": "already exists"}


    quality = 4 if 6 <= duration <= 9 else (3 if duration >= 5 else 2)

    entry = SleepEntry(
        date=sleep_time.date(),
        sleep_time=sleep_time,
        wake_time=wake_time,
        quality=quality,
        notes="Auto‑detected sleep (offline)",
        user_id=current_user.id,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"status": "created", "id": entry.id}
