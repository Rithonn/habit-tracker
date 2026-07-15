package handlers

import "net/http"

func (h Handlers) ListJournalEntries(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "list journal entries not implemented yet",
	})
}

func (h Handlers) UpsertJournalEntry(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]any{
		"message": "upsert journal entry not implemented yet",
	})
}
