package handlers

import "net/http"

func (h Handlers) ListHabits(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "list habits not implemented yet",
	})
}

func (h Handlers) CreateHabit(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "create habit not implemented yet",
	})
}

func (h Handlers) UpdateHabit(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "update habit not implemented yet",
	})
}
