from fastapi.testclient import TestClient

from app.main import app
from tests.conftest import TEST_API_KEY


client = TestClient(app)

HEADERS = {"X-API-Key": TEST_API_KEY}


def create_note(title="Test note", content="This is a test note content."):
    return client.post(
        "/notes/",
        json={"title": title, "content": content},
        headers=HEADERS
    )


# ---------- Home ----------

def test_home():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "Note Application API is running!"


# ---------- Authentication ----------

def test_missing_api_key():
    response = client.get("/notes/")

    assert response.status_code == 401


def test_invalid_api_key():
    response = client.get(
        "/notes/",
        headers={"X-API-Key": "wrong-key"}
    )

    assert response.status_code == 401


# ---------- Create note ----------

def test_create_note():
    response = create_note(
        title="Shopping list",
        content="Buy milk, eggs and bread."
    )

    assert response.status_code == 200

    data = response.json()
    assert data["id"] > 0
    assert data["title"] == "Shopping list"
    assert data["content"] == "Buy milk, eggs and bread."
    assert "created_at" in data


def test_create_note_strips_whitespace():
    response = create_note(
        title="   Padded title   ",
        content="   Padded content here   "
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Padded title"
    assert response.json()["content"] == "Padded content here"


def test_create_note_empty_title():
    response = create_note(title="")

    assert response.status_code == 422


def test_create_note_whitespace_title():
    response = create_note(title="     ")

    assert response.status_code == 422


def test_create_note_content_too_short():
    response = create_note(content="short")

    assert response.status_code == 422


def test_create_note_title_too_long():
    response = create_note(title="a" * 256)

    assert response.status_code == 422


def test_create_note_rejects_html():
    response = create_note(content="<script>alert('x')</script>")

    assert response.status_code == 422


def test_create_note_rejects_javascript_url():
    response = create_note(content="Click javascript:alert(1) now")

    assert response.status_code == 422


def test_create_note_missing_fields():
    response = client.post("/notes/", json={}, headers=HEADERS)

    assert response.status_code == 422


# ---------- List notes ----------

def test_get_notes():
    created = create_note(title="Listed note").json()

    response = client.get("/notes/", headers=HEADERS)

    assert response.status_code == 200

    ids = [note["id"] for note in response.json()]
    assert created["id"] in ids


# ---------- Analyze note ----------

def test_analyze_positive_note():
    created = create_note(
        content="I absolutely love this wonderful experience!"
    ).json()

    response = client.get(
        f"/notes/{created['id']}/analyze",
        headers=HEADERS
    )

    assert response.status_code == 200

    data = response.json()
    assert data["note_id"] == created["id"]
    assert data["sentiment"] == "positive"
    assert data["polarity"] > 0.1


def test_analyze_negative_note():
    created = create_note(
        content="I hate this terrible and horrible experience."
    ).json()

    response = client.get(
        f"/notes/{created['id']}/analyze",
        headers=HEADERS
    )

    assert response.status_code == 200
    assert response.json()["sentiment"] == "negative"


def test_analyze_note_not_found():
    response = client.get("/notes/999999/analyze", headers=HEADERS)

    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"


def test_analyze_note_invalid_id():
    response = client.get("/notes/abc/analyze", headers=HEADERS)

    assert response.status_code == 422
