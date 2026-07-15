package handlers

import "net/http"

func (h Handlers) Register(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "register not implemented yet",
	})
}

func (h Handlers) Login(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "login not implemented yet",
	})
}

func (h Handlers) Logout(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "logout not implemented yet",
	})
}

func (h Handlers) Me(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "me not implemented yet",
	})
}
