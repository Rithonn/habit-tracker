package habits

type Habit struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateHabitRequest struct {
	Name string `json:"name" validate:"required,min=1,max=100"`
}

type UpdateHabitRequest struct {
	Name string `json:"name" validate:"required,min=1,max=100"`
}
