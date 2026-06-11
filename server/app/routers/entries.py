from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User, SleepEntry
from ..schemas import SleepEntryCreate, SleepEntryOut
from .. import crud

router = APIRouter(prefix="/entries", tags=["entries"])


@router.post("/", response_model=SleepEntryOut, status_code=status.HTTP_201_CREATED)
def add_entry(
    entry: SleepEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if entry.wake_time <= entry.sleep_time:
        raise HTTPException(
            status_code=400, detail="Wake time must be after sleep time"
        )
    existing = (
        db.query(SleepEntry)
        .filter(
            SleepEntry.user_id == current_user.id,
            SleepEntry.date == entry.date,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409, detail="You already logged sleep for this date"
        )
    db_entry = crud.create_entry(db=db, entry=entry, user_id=current_user.id)
    duration = (db_entry.wake_time - db_entry.sleep_time).total_seconds() / 3600
    return SleepEntryOut(
        id=db_entry.id,
        date=db_entry.date,
        sleep_time=db_entry.sleep_time,
        wake_time=db_entry.wake_time,
        quality=db_entry.quality,
        notes=db_entry.notes,
        user_id=db_entry.user_id,
        duration_hours=round(duration, 2),
    )


@router.get("/", response_model=list[SleepEntryOut])
def read_entries(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    entries = crud.get_entries(db=db, user_id=current_user.id)
    result = []
    for e in entries:
        duration = (e.wake_time - e.sleep_time).total_seconds() / 3600
        result.append(
            SleepEntryOut(
                id=e.id,
                date=e.date,
                sleep_time=e.sleep_time,
                wake_time=e.wake_time,
                quality=e.quality,
                notes=e.notes,
                user_id=e.user_id,
                duration_hours=round(duration, 2),
            )
        )
    return result


@router.put("/{entry_id}", response_model=SleepEntryOut)
def update_entry(
    entry_id: int,
    entry: SleepEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if entry.wake_time <= entry.sleep_time:
        raise HTTPException(
            status_code=400, detail="Wake time must be after sleep time"
        )
    updated = crud.update_entry(
        db=db, entry_id=entry_id, user_id=current_user.id, data=entry
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Entry not found")
    duration = (updated.wake_time - updated.sleep_time).total_seconds() / 3600
    return SleepEntryOut(
        id=updated.id,
        date=updated.date,
        sleep_time=updated.sleep_time,
        wake_time=updated.wake_time,
        quality=updated.quality,
        notes=updated.notes,
        user_id=updated.user_id,
        duration_hours=round(duration, 2),
    )


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = crud.delete_entry(db=db, entry_id=entry_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Entry not found")
