package handlers

import "net/http"

type Handlers struct{}

func New() Handlers {
	return Handlers{}
}

func (h Handlers) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status": "ok",
	})
}
