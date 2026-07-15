package habits

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/ritho/habit-tracker/backend-go/internal/http/identity"
	"github.com/ritho/habit-tracker/backend-go/internal/http/respond"
	"github.com/ritho/habit-tracker/backend-go/internal/http/validate"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) Handler {
	return Handler{service: service}
}

func (h Handler) List(w http.ResponseWriter, r *http.Request) {
	userID := identity.UserIDOrDefault(r.Context(), "dev-user")
	habits, err := h.service.List(r.Context(), userID)
	if err != nil {
		h.writeServiceError(w, err, "list habits")
		return
	}

	respond.JSON(w, http.StatusOK, habits)
}

func (h Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateHabitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": "invalid request payload"})
		return
	}
	if message := validate.Struct(req); message != "" {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": message})
		return
	}

	userID := identity.UserIDOrDefault(r.Context(), "dev-user")
	habit, err := h.service.Create(r.Context(), userID, req)
	if err != nil {
		h.writeServiceError(w, err, "create habit")
		return
	}

	respond.JSON(w, http.StatusCreated, habit)
}

func (h Handler) Update(w http.ResponseWriter, r *http.Request) {
	habitID := chi.URLParam(r, "habitID")
	if habitID == "" {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": "missing habitID"})
		return
	}

	var req UpdateHabitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": "invalid request payload"})
		return
	}
	if message := validate.Struct(req); message != "" {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": message})
		return
	}

	userID := identity.UserIDOrDefault(r.Context(), "dev-user")
	habit, err := h.service.Update(r.Context(), userID, habitID, req)
	if err != nil {
		h.writeServiceError(w, err, "update habit")
		return
	}

	respond.JSON(w, http.StatusOK, habit)
}

func (h Handler) writeServiceError(w http.ResponseWriter, err error, action string) {
	if errors.Is(err, ErrNotImplemented) {
		respond.JSON(w, http.StatusNotImplemented, map[string]any{"message": action + " not implemented yet"})
		return
	}

	respond.JSON(w, http.StatusInternalServerError, map[string]any{"message": "internal server error"})
}
