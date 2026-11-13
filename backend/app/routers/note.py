from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteResponse

from app.core.security import verify_api_key

from app.services.sentiment import analyze_sentiment

router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
    dependencies=[Depends(verify_api_key)]
)


@router.post("/", response_model=NoteResponse)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
):
    new_note = Note(
        title=note.title,
        content=note.content
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note


@router.get("/", response_model=list[NoteResponse])
def get_notes(
    db: Session = Depends(get_db), 
):
    notes = db.query(Note).all()

    return notes

@router.get("/{id}/analyze")
def analyze_note(
    id: int,
    db: Session = Depends(get_db),
):
    note = db.query(Note).filter(
        Note.id == id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    result = analyze_sentiment(note.content)

    return {
        "note_id": note.id,
        "title": note.title,
        "content": note.content,
        "sentiment": result["sentiment"],
        "polarity": result["polarity"]
    }