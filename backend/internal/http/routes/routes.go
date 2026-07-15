package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/ritho/habit-tracker/backend-go/internal/http/handlers"
)

func Register(r chi.Router, basePath string, h handlers.Handlers) {
	r.Route(basePath, func(api chi.Router) {
		api.Get("/health", h.Health)
		api.Post("/auth/register", h.Register)
		api.Post("/auth/login", h.Login)
		api.Post("/auth/logout", h.Logout)
		api.Get("/me", h.Me)

		api.Route("/habits", func(habits chi.Router) {
			habits.Get("/", h.ListHabits)
			habits.Post("/", h.CreateHabit)
			habits.Patch("/{habitID}", h.UpdateHabit)
		})

		api.Route("/journal", func(journal chi.Router) {
			journal.Get("/", h.ListJournalEntries)
			journal.Put("/{date}", h.UpsertJournalEntry)
		})
	})
}
