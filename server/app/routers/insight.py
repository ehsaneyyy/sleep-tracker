from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import User
from .. import crud, utils

router = APIRouter(prefix="/insight", tags=["insight"])


@router.get("/")
def get_insight(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    entries = crud.get_entries(db=db, user_id=current_user.id)
    return {"insight": utils.generate_sleep_insight(entries)}
