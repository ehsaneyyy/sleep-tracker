from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class SleepEntryCreate(BaseModel):
    date: datetime
    sleep_time: datetime
    wake_time: datetime
    quality: int = Field(..., ge=1, le=5)
    notes: Optional[str] = None


class SleepEntryOut(BaseModel):
    id: int
    date: datetime
    sleep_time: datetime
    wake_time: datetime
    quality: int
    notes: Optional[str]
    user_id: int
    duration_hours: float

    class Config:
        from_attributes = True


class IdleEventCreate(BaseModel):
    event_type: str
    timestamp: datetime


class IdleEventOut(BaseModel):
    id: int
    user_id: int
    event_type: str
    timestamp: datetime

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    email: str
    name: str | None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: str
