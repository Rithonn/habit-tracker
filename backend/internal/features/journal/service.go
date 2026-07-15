package journal

import (
	"context"
	"errors"
)

var ErrNotImplemented = errors.New("not implemented")

type Service interface {
	ListByMonth(ctx context.Context, userID, month string) ([]Entry, error)
	Upsert(ctx context.Context, userID, date string, req UpsertEntryRequest) (Entry, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return service{repo: repo}
}

func (s service) ListByMonth(ctx context.Context, userID, month string) ([]Entry, error) {
	return s.repo.ListByMonth(ctx, userID, month)
}

func (s service) Upsert(ctx context.Context, userID, date string, req UpsertEntryRequest) (Entry, error) {
	return s.repo.Upsert(ctx, userID, date, req)
}
