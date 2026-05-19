from fastapi import FastAPI
from .routers import users, entries, insight

app = FastAPI()

app.include_router(users.router)
app.include_router(entries.router)
app.include_router(insight.router)
