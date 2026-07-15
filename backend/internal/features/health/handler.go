package health

import (
	"net/http"

	"github.com/ritho/habit-tracker/backend-go/internal/http/respond"
)

type Handler struct{}

func NewHandler() Handler {
	return Handler{}
}

func (h Handler) GetHealth(w http.ResponseWriter, r *http.Request) {
	respond.JSON(w, http.StatusOK, map[string]any{
		"status": "ok",
	})
}
