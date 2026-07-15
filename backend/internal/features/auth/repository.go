package auth

import "context"

type Repository interface {
	CreateUser(ctx context.Context, req RegisterRequest) error
	GetSessionByCredentials(ctx context.Context, req LoginRequest) (Session, error)
	ClearSession(ctx context.Context, userID string) error
	GetSession(ctx context.Context, userID string) (Session, error)
}

type memoryRepository struct{}

func NewMemoryRepository() Repository {
	return memoryRepository{}
}

func (r memoryRepository) CreateUser(ctx context.Context, req RegisterRequest) error {
	return ErrNotImplemented
}

func (r memoryRepository) GetSessionByCredentials(ctx context.Context, req LoginRequest) (Session, error) {
	return Session{}, ErrNotImplemented
}

func (r memoryRepository) ClearSession(ctx context.Context, userID string) error {
	return ErrNotImplemented
}

func (r memoryRepository) GetSession(ctx context.Context, userID string) (Session, error) {
	return Session{}, ErrNotImplemented
}
