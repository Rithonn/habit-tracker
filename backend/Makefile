APP_NAME=habit-tracker-api
DATABASE_URL?=postgres://postgres:postgres@localhost:5432/habit_tracker?sslmode=disable
GOOSE_DRIVER=postgres
GOOSE_CMD=go run github.com/pressly/goose/v3/cmd/goose@latest

.PHONY: run build tidy test migrate-up migrate-down migrate-status

run:
	go run ./cmd/api

build:
	go build -o ./bin/$(APP_NAME) ./cmd/api

tidy:
	go mod tidy

test:
	go test ./...

migrate-up:
	$(GOOSE_CMD) -dir migrations $(GOOSE_DRIVER) "$(DATABASE_URL)" up

migrate-down:
	$(GOOSE_CMD) -dir migrations $(GOOSE_DRIVER) "$(DATABASE_URL)" down

migrate-status:
	$(GOOSE_CMD) -dir migrations $(GOOSE_DRIVER) "$(DATABASE_URL)" status
