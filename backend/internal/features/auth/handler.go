package auth

import (
	"encoding/json"
	"errors"
	"net/http"

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

func (h Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": "invalid request payload"})
		return
	}
	if message := validate.Struct(req); message != "" {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": message})
		return
	}

	if err := h.service.Register(r.Context(), req); err != nil {
		h.writeServiceError(w, err, "register")
		return
	}

	respond.JSON(w, http.StatusCreated, map[string]any{"message": "user created"})
}

func (h Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": "invalid request payload"})
		return
	}
	if message := validate.Struct(req); message != "" {
		respond.JSON(w, http.StatusBadRequest, map[string]any{"message": message})
		return
	}

	session, err := h.service.Login(r.Context(), req)
	if err != nil {
		h.writeServiceError(w, err, "login")
		return
	}

	respond.JSON(w, http.StatusOK, session)
}

func (h Handler) Logout(w http.ResponseWriter, r *http.Request) {
	userID := identity.UserIDOrDefault(r.Context(), "dev-user")
	if err := h.service.Logout(r.Context(), userID); err != nil {
		h.writeServiceError(w, err, "logout")
		return
	}

	respond.JSON(w, http.StatusOK, map[string]any{"message": "logged out"})
}

func (h Handler) Me(w http.ResponseWriter, r *http.Request) {
	userID := identity.UserIDOrDefault(r.Context(), "dev-user")
	session, err := h.service.Me(r.Context(), userID)
	if err != nil {
		h.writeServiceError(w, err, "me")
		return
	}

	respond.JSON(w, http.StatusOK, session)
}

func (h Handler) writeServiceError(w http.ResponseWriter, err error, action string) {
	if errors.Is(err, ErrNotImplemented) {
		respond.JSON(w, http.StatusNotImplemented, map[string]any{"message": action + " not implemented yet"})
		return
	}

	respond.JSON(w, http.StatusInternalServerError, map[string]any{"message": "internal server error"})
}
