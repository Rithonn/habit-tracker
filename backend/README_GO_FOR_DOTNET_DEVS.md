# Go Backend Onboarding for C#/.NET Developers

This guide is for developers who are comfortable with C#/.NET and are new to Go.

## TL;DR Mental Model Shift

Go is intentionally smaller than C#:

1. Fewer language features and less framework magic.
2. Composition over inheritance.
3. Explicit error returns instead of exceptions for normal control flow.
4. Fast compile/run cycle with simple tooling.

If you are used to ASP.NET Core with DI + middleware + controllers, this project will feel familiar, just more minimal and explicit.

## Concept Mapping: C# to Go

| C# / .NET | Go Equivalent | Notes |
|---|---|---|
| Namespace | package | One package per folder (usually). |
| Class | struct + functions/methods | Data and behavior are often separated. |
| Interface | interface | Usually small and defined where consumed. |
| Dependency Injection container | Constructor/inject pattern | Explicit wiring, often no container needed. |
| Exception handling | `error` return values | Errors are values; handle early and clearly. |
| Controller action | Handler function | `func(w http.ResponseWriter, r *http.Request)` |
| Middleware pipeline | Router middleware | Similar concept in chi/gin/echo. |
| appsettings.json | Environment variables | Common in Go services. |
| Entity Framework | sqlc/GORM/database/sql | You choose your abstraction level. |
| async/await Task | goroutines + channels | Concurrency model is lightweight and different. |

## Project Layout in This Repo

- `cmd/api/main.go`: app entrypoint and graceful shutdown.
- `internal/config`: environment-based configuration.
- `internal/server`: HTTP server, router, CORS setup.
- `internal/http/routes`: route registration.
- `internal/http/handlers`: endpoint handlers.
- `internal/storage/postgres`: database wiring location.
- `migrations`: SQL schema changes.

A useful rule: keep feature logic grouped by business area (auth, habits, journal), and keep transport concerns in handlers/middleware.

## Running the Backend Locally

1. Open terminal in `backend`.
2. Copy `.env.example` to `.env`.
3. Run `go mod tidy`.
4. Run `go run ./cmd/api`.
5. Verify `GET /api/v1/health`.

## How Request Flow Works

1. `main.go` loads config and starts HTTP server.
2. `server.New(...)` builds router and middleware.
3. `routes.Register(...)` maps endpoints to handlers.
4. Handler validates/parses request and calls business service.
5. Service talks to persistence layer.
6. Handler writes JSON response.

This is close to ASP.NET Core startup + endpoints, but with less built-in abstraction.

## Go Patterns to Use Here

## 1) Return errors, do not throw for expected failures

Typical function shape:

- `func (...) (..., error)`

Handle errors near source and return contextual messages upward.

## 2) Keep interfaces near consumers

In C#, interfaces are often defined centrally. In Go, define tiny interfaces where you need them (usually in service layer tests).

## 3) Keep structs simple and explicit

Avoid deep inheritance-style design. Prefer plain structs and clear constructors.

## 4) Prefer small packages

If a folder grows too large, split by feature/subdomain rather than by technical layer only.

## Error Handling Style (Important)

In Go, this is normal:

1. Check `if err != nil` frequently.
2. Return early.
3. Wrap with context when useful.

This is one of the biggest shifts from C# exception flow.

## Concurrency Notes for .NET Developers

- Goroutines are lightweight threads managed by Go runtime.
- Channels are typed pipes for communication.
- Use concurrency only where needed; keep request handlers straightforward first.

Do not add goroutines in handlers unless there is a clear latency/perf reason and cancellation semantics are defined.

## Testing Approach

Start with:

1. Unit tests for services (business logic).
2. Handler tests with `httptest`.
3. Integration tests for DB-backed repositories.

Command:

- `go test ./...`

## Common Gotchas for C# Developers

1. Unused variables/imports are compile errors.
2. `nil` handling matters for pointers, slices, maps, interfaces.
3. Map iteration order is random.
4. Exported names are capitalized (`MyType`), non-exported are lowercase.
5. There is no implicit try/catch around request handlers.
6. Receivers can be value or pointer; choose intentionally.

## Suggested Next Implementation Steps in This Backend

1. Add Postgres connection bootstrap in `internal/storage/postgres`.
2. Add migration runner command or startup check.
3. Implement auth service (register/login/me).
4. Add auth middleware for protected routes.
5. Implement habits and journal services + repositories.
6. Add request validation and shared error response format.

## Recommended Go Learning Track (Practical)

1. Learn structs, methods, interfaces, error handling.
2. Build one end-to-end endpoint (request -> service -> repo -> response).
3. Add table-driven tests.
4. Add one middleware (auth or request logging).
5. Learn context cancellation/timeouts in DB and HTTP calls.

If you follow this repo structure and keep things explicit, your .NET experience will transfer very quickly.
