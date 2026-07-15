# Habit Tracker Go Backend

This folder contains a Go API scaffold for the Habit Tracker app. It is designed to pair with the Angular frontend and replace browser-only persistence with authenticated, database-backed storage.

## What Is Scaffolded

- HTTP server entrypoint: `cmd/api/main.go`
- Config loading from environment: `internal/config`
- Router and CORS setup: `internal/server`
- Structured request logging middleware (zerolog): `internal/http/middleware/logging.go`
- JWT auth middleware with development fallback identity: `internal/http/middleware/auth.go`
- Request payload validation helper (go-playground/validator): `internal/http/validate`
- Feature slices with explicit boundaries:
   - `internal/features/auth` (handler, service, repository)
   - `internal/features/habits` (handler, service, repository)
   - `internal/features/journal` (handler, service, repository)
   - `internal/features/health` (health handler)
- API routes:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/me`
  - `GET /api/v1/habits`
  - `POST /api/v1/habits`
  - `PATCH /api/v1/habits/{habitID}`
  - `GET /api/v1/journal`
  - `PUT /api/v1/journal/{date}`
  - `GET /api/v1/health`
- Placeholder handlers for auth, habits, and journal
- Initial Postgres migrations in `migrations`
- Migration workflow commands in `Makefile` via goose (`migrate-up`, `migrate-down`, `migrate-status`)
- Local env template: `.env.example`

## Quick Start

1. Install Go 1.25+
2. Copy env file:
   - `cp .env.example .env` (PowerShell: `Copy-Item .env.example .env`)
3. Download dependencies:
   - `go mod tidy`
4. Run API:
   - `go run ./cmd/api`
5. Health check:
   - `GET http://localhost:8080/api/v1/health`

## Plan Of Attack

### Phase 1: Wire Core Infrastructure

1. Add Postgres connection bootstrap with ping and graceful close.
2. Add migration runner (golang-migrate).
3. Add request logging and request ID middleware.

### Phase 2: Auth Foundation

1. Implement user registration with password hashing (bcrypt).
2. Implement login with short-lived access token and refresh token.
3. Add middleware to verify access token and attach user identity.
4. Implement `/me` for session restore in frontend.

### Phase 3: Habit And Journal Data

1. Implement habit CRUD for authenticated user.
2. Implement monthly habit-entry read/write.
3. Implement journal upsert and monthly read.
4. Add input validation and consistent error responses.

### Phase 4: Frontend Integration

1. Replace localStorage as source of truth with API calls.
2. Keep local cache only as optional fallback.
3. Add Angular auth guard and interceptor for auth headers/cookies.
4. Add optimistic updates for day toggles and journal entry edits.

### Phase 5: Production Readiness (Vercel Frontend + Hosted Go API)

1. Configure CORS allowlist for Vercel domains.
2. Add secure secrets in deployment environment.
3. Add rate limiting for auth endpoints.
4. Add structured logging and error monitoring.
5. Add smoke tests for login + dashboard flows.

## Why This Workflow

A detailed explanation of the selected API workflow and wiring decisions is documented in:

- [README_API_WORKFLOW_WIRING.md](./README_API_WORKFLOW_WIRING.md)

## Suggested Next Files To Implement

- `internal/auth/service.go`
- `internal/auth/jwt.go`
- `internal/habits/service.go`
- `internal/journal/service.go`
- `internal/http/middleware/auth.go`
- `internal/http/middleware/logging.go`

## Notes

- The scaffold intentionally returns `501 Not Implemented` for most business endpoints until auth and data layers are wired.
- Current Angular localStorage persistence can remain during transition and be removed after API integration is complete.

## New To Go?

- C#/.NET onboarding guide: [README_GO_FOR_DOTNET_DEVS.md](./README_GO_FOR_DOTNET_DEVS.md)
- Go tips and practical cheatsheet: [README_GO_TIPS.md](./README_GO_TIPS.md)
