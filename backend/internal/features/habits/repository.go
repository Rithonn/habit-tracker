package habits

import "context"

type Repository interface {
	List(ctx context.Context, userID string) ([]Habit, error)
	Create(ctx context.Context, userID string, req CreateHabitRequest) (Habit, error)
	Update(ctx context.Context, userID, habitID string, req UpdateHabitRequest) (Habit, error)
}

type memoryRepository struct{}

func NewMemoryRepository() Repository {
	return memoryRepository{}
}

func (r memoryRepository) List(ctx context.Context, userID string) ([]Habit, error) {
	return nil, ErrNotImplemented
}

func (r memoryRepository) Create(ctx context.Context, userID string, req CreateHabitRequest) (Habit, error) {
	return Habit{}, ErrNotImplemented
}

func (r memoryRepository) Update(ctx context.Context, userID, habitID string, req UpdateHabitRequest) (Habit, error) {
	return Habit{}, ErrNotImplemented
}
