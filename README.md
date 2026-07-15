# Habit Tracker Monorepo

This repository is organized into separate frontend and backend projects.

## Project Structure

- Frontend (Angular): [frontend/README.md](./frontend/README.md)
- Backend (Go API): [backend/README.md](./backend/README.md)

## Quick Start

### Run Frontend + Backend Together

From the repository root:

1. `./dev-all.ps1`

What it does:

- Opens a new PowerShell window and starts the Go API from `backend` using `go run ./cmd/api`.
- Starts the Angular frontend from `frontend` in your current terminal using `npm start`.

How to stop:

- Press `Ctrl+C` in the frontend terminal.
- Close the backend PowerShell window (or press `Ctrl+C` there).

If script execution is blocked in PowerShell:

- `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run start`
4. `npm run build`

### Backend

1. `cd backend`
2. `go mod tidy`
3. `go run ./cmd/api`
4. `go test ./...`

## Notes

- Frontend and backend are intentionally decoupled for independent deployment.
- For backend implementation roadmap, see [backend/README.md](./backend/README.md).

## Go-Live Checklist

The following items still need to be completed before the project is ready for production:

- Replace placeholder and in-memory backend implementations with real database-backed repositories.
- Wire real auth flows end to end: register, login, logout, token/session handling, and protected route enforcement.
- Connect the frontend to the real API endpoints instead of local-only fallback data.
- Move API base URLs, JWT settings, and CORS allowlists into environment-specific configuration.
- Confirm Postgres migrations run cleanly in deployment and on fresh environments.
- Add validation and error handling for all request payloads and user-facing failures.
- Add integration or smoke tests for healthcheck, auth, habit CRUD, and journal save/load flows.
- Add production logging, monitoring, and rate limiting for sensitive endpoints.
- Verify deployment build and runtime settings for both frontend and backend.
