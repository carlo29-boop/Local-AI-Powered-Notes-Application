import os
import tempfile

# Must run before the app is imported: security.py needs API_KEY at import time,
# and tests should use a throwaway database instead of notes.db.
TEST_API_KEY = "test-api-key"

os.environ["API_KEY"] = TEST_API_KEY
os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(
    tempfile.mkdtemp(), "test_notes.db"
)
