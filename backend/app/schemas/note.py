from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import re

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class NoteCreate(BaseModel):

    title: str = Field(
        min_length=1,
        max_length=255
    )

    content: str = Field(
        min_length=10,
        max_length=10000
    )

    @field_validator("title", "content")
    @classmethod
    def validate_input(cls, value):

        value = value.strip()

        if not value:
            raise ValueError("Field cannot be empty")

        # Reject HTML tags
        if re.search(r"<[^>]*>", value):
            raise ValueError("HTML tags are not allowed")

        # Reject JavaScript URL patterns
        if re.search(r"javascript\s*:", value, re.IGNORECASE):
            raise ValueError("JavaScript URLs are not allowed")

        return value