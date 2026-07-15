package journal

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
	month := r.URL.Query().Get("month")
	userID := identity.UserIDOrDefault(r.Context(), "dev-user")
	entries, err := h.service.ListByMonth(r.Context(), userID, month)
	if err != nil {
		h.writeServiceError(w, err, "list journal entries")
		return
	}

	respond.JSON(w, http.StatusOK, entries)
}

func (h Handler) Upsert(w http.ResponseWriter, r *http.Request) {
	date := chi.URLParam(r, "date")
	if date == "" {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": "missing date"})
		return
	}

	var req UpsertEntryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": "invalid request payload"})
		return
	}
	if message := validate.Struct(req); message != "" {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": message})
		return
	}

	userID := identity.UserIDOrDefault(r.Context(), "dev-user")
	entry, err := h.service.Upsert(r.Context(), userID, date, req)
	if err != nil {
		h.writeServiceError(w, err, "upsert journal entry")
		return
	}

	respond.JSON(w, http.StatusOK, entry)
}

func (h Handler) writeServiceError(w http.ResponseWriter, err error, action string) {
	if errors.Is(err, ErrNotImplemented) {
		respond.JSON(w, http.StatusNotImplemented, map[string]any{"message": action + " not implemented yet"})
		return
	}

	respond.JSON(w, http.StatusInternalServerError, map[string]any{"message": "internal server error"})
}
