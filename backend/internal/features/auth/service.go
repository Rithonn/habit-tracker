package auth

import (
	"context"
	"errors"
)

var ErrNotImplemented = errors.New("not implemented")

type Service interface {
	Register(ctx context.Context, req RegisterRequest) error
	Login(ctx context.Context, req LoginRequest) (Session, error)
	Logout(ctx context.Context, userID string) error
	Me(ctx context.Context, userID string) (Session, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return service{repo: repo}
}

func (s service) Register(ctx context.Context, req RegisterRequest) error {
	return s.repo.CreateUser(ctx, req)
}

func (s service) Login(ctx context.Context, req LoginRequest) (Session, error) {
	return s.repo.GetSessionByCredentials(ctx, req)
}

func (s service) Logout(ctx context.Context, userID string) error {
	return s.repo.ClearSession(ctx, userID)
}

func (s service) Me(ctx context.Context, userID string) (Session, error) {
	return s.repo.GetSession(ctx, userID)
}
