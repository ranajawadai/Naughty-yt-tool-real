from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(
    title="YouTube Intelligence Suite",
    description="A comprehensive FastAPI backend for YouTube metadata extraction, search, comparison, and export using yt-dlp.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="", tags=["youtube"])
