package journal

import "context"

type Repository interface {
	ListByMonth(ctx context.Context, userID, month string) ([]Entry, error)
	Upsert(ctx context.Context, userID, date string, req UpsertEntryRequest) (Entry, error)
}

type memoryRepository struct{}

func NewMemoryRepository() Repository {
	return memoryRepository{}
}

func (r memoryRepository) ListByMonth(ctx context.Context, userID, month string) ([]Entry, error) {
	return nil, ErrNotImplemented
}

func (r memoryRepository) Upsert(ctx context.Context, userID, date string, req UpsertEntryRequest) (Entry, error) {
	return Entry{}, ErrNotImplemented
}
