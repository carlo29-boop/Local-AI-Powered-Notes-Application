# Note Application – How to Run with Docker

## Requirements

- Docker Desktop (with Docker Compose) installed and running.

## 1. Set Up Environment Files

Copy the example environment files (skip if `.env` files already exist):

```text
backend/.env.example  →  backend/.env
frontend/.env.example →  frontend/.env
```

**Backend: `backend/.env`**

```env
API_KEY=<your api key>
DATABASE_URL=sqlite:////data/notes.db
```

**Frontend: `frontend/.env`**

```env
VITE_API_BASE_URL=http://localhost:8001
VITE_API_KEY=<same value as API_KEY in backend/.env>
```

**Notes:**

- `VITE_API_KEY` must match the backend `API_KEY`.
- `VITE_API_BASE_URL` must stay `http://localhost:8001`, because the browser calls the backend directly, not the frontend container.

## 2. Start the App

From the project root (the folder that contains `docker-compose.yml`):

```bash
docker compose up --build
```

## 3. Open the App

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8001 |
| API Docs | http://localhost:8001/docs |

## Useful Commands

| Command | Description |
|---|---|
| `docker compose down` | Stop the app |
| `docker compose down -v` | Stop and delete all notes |
| `docker compose logs -f` | View logs |
| `docker compose exec backend pytest` | Run backend tests |