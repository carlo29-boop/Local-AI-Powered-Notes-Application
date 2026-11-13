from fastapi import Depends, FastAPI
from requests import Session

from app.database.connection import engine, Base
from app.routers.note import router as note_router

from fastapi.middleware.cors import CORSMiddleware



Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(note_router)

@app.get("/")
def home():
    return {
        "message": "Local AI-Powered Notes Application API is running!"
    }