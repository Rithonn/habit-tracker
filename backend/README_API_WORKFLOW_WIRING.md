# API Workflow Wiring: Why We Chose This Stack

This document explains the workflow wiring choices we made for the Go backend and why each decision supports maintainability, correctness, and fast iteration.

## Goals

1. Keep the API easy to reason about while the product is still evolving.
2. Add production-relevant guardrails early (auth boundary, validation, logging).
3. Avoid over-engineering before repositories are fully implemented.
4. Preserve smooth local development while we transition from browser-only persistence.

## Selected Workflow Stack

- Router and composition: `chi`
- Structured logging: `zerolog`
- Request validation: `go-playground/validator`
- JWT verification middleware: `golang-jwt/jwt/v5`
- Migration workflow: `goose` via `go run .../cmd/goose@latest`

## Why This Combination

### 1) `chi` for routing and middleware composition

- It stays close to net/http idioms, so handlers are plain Go functions.
- Middleware chaining is explicit and readable.
- Route groups let us clearly separate public and protected API surfaces.

### 2) `zerolog` for low-overhead structured logs

- JSON logs are machine-parsable and easy to filter in observability tools.
- We log request metadata (`method`, `path`, `status`, `duration`, `request_id`) consistently.
- It is fast and minimal, which fits APIs where logging volume can grow quickly.

### 3) `validator` for request boundary correctness

- Input contracts live directly in request DTO tags.
- Validation happens before service calls, keeping service logic cleaner.
- API clients receive immediate and predictable `400` responses for malformed payloads.

### 4) JWT middleware to enforce a clean protected boundary

- Protected endpoints are grouped once in routing and guarded uniformly.
- User identity is attached to request context, removing hardcoded IDs in handlers.
- In `development`, we allow a fallback `dev-user` identity when no bearer token exists so current local workflows are not blocked while auth persistence is being implemented.

### 5) Goose migration commands in Makefile

- Migrations become part of day-to-day workflow (`migrate-up`, `migrate-down`, `migrate-status`).
- New contributors can run one command without installing global binaries first.
- Keeps schema evolution explicit and reviewable in source control.

## Request Flow (Current Wiring)

1. Request enters router.
2. Core middleware runs (`RequestID`, `RealIP`, structured request logging, panic recovery, CORS).
3. Public routes are handled directly (`/health`, `/auth/*`).
4. Protected routes run JWT middleware first (`/me`, `/habits/*`, `/journal/*`).
5. Handler decodes JSON and validates request DTOs.
6. Handler calls service layer.
7. Response helper writes consistent JSON output.

## Trade-offs and Intentional Choices

- We did not introduce an ORM yet.
- We did not issue JWTs yet from auth login because auth repository/service are still scaffold placeholders.
- We kept middleware and validation thin to avoid locking into a complex framework too early.

This is intentional: we are optimizing for clean seams now so repository implementation can evolve without route-level rewrites.

## How To Use This Workflow

### Run API

```powershell
go run ./cmd/api
```

### Run migrations

```powershell
make migrate-status
make migrate-up
make migrate-down
```

### Test auth-protected routes in development

In `APP_ENV=development`, protected routes will still resolve a fallback identity (`dev-user`) if no bearer token is provided. This keeps local development moving while JWT issuing is being implemented.

In non-development environments, bearer token is required for protected routes.

## Next Recommended Step

Implement JWT issuing in `auth.Login` and return an access token in the login response so the frontend can call protected routes using real bearer authentication end-to-end.
