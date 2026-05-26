from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User
from ..schemas import IdleEventCreate
from .. import crud, auto_sleep
from ..models import SleepEntry

router = APIRouter(prefix="/auto", tags=["auto"])


@router.post("/event")
def receive_event(
    event: IdleEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    crud.create_idle_event(db, current_user.id, event.event_type, event.timestamp)

    recent = crud.get_recent_idle_events(db, current_user.id, hours=24)
    start, end, duration = auto_sleep.detect_sleep_window(recent)

    if start and end:
        existing = (
            db.query(SleepEntry)
            .filter(
                SleepEntry.user_id == current_user.id,
                SleepEntry.sleep_time == start,
            )
            .first()
        )
        if not existing:
            quality = 4 if 6 <= duration <= 9 else (3 if duration >= 5 else 2)
            entry = SleepEntry(
                date=start.date(),
                sleep_time=start,
                wake_time=end,
                quality=quality,
                notes="Auto-detected sleep",
                user_id=current_user.id,
            )
            db.add(entry)
            db.commit()

    return {"status": "ok"}
