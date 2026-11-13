import os
import secrets

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

load_dotenv()

# API_KEY = os.getenv(
#     "API_KEY",
#     "TEST1231231231321"
# )

API_KEY = os.getenv("API_KEY")


if not API_KEY:
    raise RuntimeError("API_KEY is not configured")

api_key_header = APIKeyHeader(
    name="X-API-Key",
    auto_error=False
)


def verify_api_key(
    api_key: str | None = Depends(api_key_header)
):
    if not api_key or not secrets.compare_digest(api_key, API_KEY):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key"
        )

    return api_key