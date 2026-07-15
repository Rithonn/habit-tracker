# Go Helpful Tips and Practical Notes

This is a quick reference for day-to-day Go development in this backend.

## Daily Commands

1. Format code:
   - `gofmt -w .`
2. Static checks + compile all packages:
   - `go test ./...`
3. Tidy dependencies:
   - `go mod tidy`
4. Run API:
   - `go run ./cmd/api`
5. Build binary:
   - `go build -o ./bin/habit-tracker-api ./cmd/api`

## Go Project Habits

1. Keep packages small and feature-focused.
2. Prefer explicit wiring over hidden magic.
3. Keep handler -> service -> repository flow clean.
4. Define interfaces where they are consumed, not globally by default.

## Error Handling Tips

1. Errors are values; check early and return early.
2. Add context to errors before returning.
3. Avoid panic for expected failures.
4. In HTTP handlers, map domain errors to clear status codes.

## Common Data Structure Notes

1. Slices:
   - zero value is `nil` and usable for append.
2. Maps:
   - must initialize with `make` before assignment.
   - iteration order is not guaranteed.
3. Struct tags:
   - keep JSON field names stable and explicit.

## Pointer vs Value Receivers

Use pointer receivers when:

1. Method mutates receiver state.
2. Struct is large and copying is undesirable.
3. You want consistent method set across usage.

Use value receivers when:

1. Struct is small and immutable in method behavior.

## HTTP API Tips

1. Set `Content-Type: application/json` for JSON responses.
2. Decode request JSON with strict validation where practical.
3. Keep request and response DTOs separate from DB models.
4. Return consistent error shape:
   - code
   - message
   - optional details

## Database and SQL Tips

1. Keep migrations idempotent and reversible.
2. Add unique constraints for business keys.
3. Use transactions for multi-step writes.
4. Always pass context into DB calls.
5. Prefer explicit SQL for critical paths.

## Context and Timeouts

1. Pass `context.Context` through service and repository boundaries.
2. Add timeouts for external/database operations.
3. Respect cancellation to avoid leaked work.

## Concurrency Tips

1. Do not add goroutines in request handlers unless necessary.
2. If using goroutines, define cancellation and error propagation strategy.
3. Protect shared mutable state (mutex/channels) when needed.

## Logging and Observability

1. Use structured logs (key/value style).
2. Include request ID, user ID (if available), and route.
3. Avoid logging secrets/tokens/passwords.

## Security Basics

1. Hash passwords with bcrypt/argon2.
2. Keep secrets in environment variables only.
3. Validate and sanitize input.
4. Use secure cookie settings or robust token strategy.
5. Add rate limiting on auth endpoints.

## Testing Tips

1. Prefer table-driven tests for pure logic.
2. Use `httptest` for handler testing.
3. Keep integration tests focused and deterministic.
4. Test happy path and failure path for every endpoint.

## Git and Refactor Safety

1. Keep PRs small and focused.
2. Move files without changing behavior first, then refactor.
3. Run `go test ./...` before pushing.

## Repo-Specific Notes

1. Backend root is `backend`.
2. API entrypoint is `cmd/api/main.go`.
3. Routes are registered in `internal/http/routes/routes.go`.
4. Current scaffold handlers return `501 Not Implemented` until business logic is implemented.
