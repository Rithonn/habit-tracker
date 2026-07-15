APP_NAME=habit-tracker-api

.PHONY: run build tidy test

run:
	go run ./cmd/api

build:
	go build -o ./bin/$(APP_NAME) ./cmd/api

tidy:
	go mod tidy

test:
	go test ./...
