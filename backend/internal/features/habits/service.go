package habits

import (
	"context"
	"errors"
)

var ErrNotImplemented = errors.New("not implemented")

type Service interface {
	List(ctx context.Context, userID string) ([]Habit, error)
	Create(ctx context.Context, userID string, req CreateHabitRequest) (Habit, error)
	Update(ctx context.Context, userID, habitID string, req UpdateHabitRequest) (Habit, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return service{repo: repo}
}

func (s service) List(ctx context.Context, userID string) ([]Habit, error) {
	return s.repo.List(ctx, userID)
}

func (s service) Create(ctx context.Context, userID string, req CreateHabitRequest) (Habit, error) {
	return s.repo.Create(ctx, userID, req)
}

func (s service) Update(ctx context.Context, userID, habitID string, req UpdateHabitRequest) (Habit, error) {
	return s.repo.Update(ctx, userID, habitID, req)
}
