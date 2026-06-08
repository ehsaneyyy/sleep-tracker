from fastapi import FastAPI
from .routers import users, entries, insight, auto
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://sleep-tracker-3ytgq1vtf-mohammed-ehsans-projects-0cf79ab6.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(entries.router)
app.include_router(insight.router)
app.include_router(auto.router)
