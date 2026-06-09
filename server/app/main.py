from fastapi import FastAPI
from .routers import users, entries, insight, auto
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()



class CorsHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = (
            "https://sleep-tracker-self.vercel.app"
        )
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, DELETE, OPTIONS"
        )
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response


app.add_middleware(CorsHeaderMiddleware)


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sleep-tracker-self.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(entries.router)
app.include_router(insight.router)
app.include_router(auto.router)
