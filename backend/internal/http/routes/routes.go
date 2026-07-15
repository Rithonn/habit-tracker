package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/ritho/habit-tracker/backend-go/internal/features/auth"
	"github.com/ritho/habit-tracker/backend-go/internal/features/habits"
	"github.com/ritho/habit-tracker/backend-go/internal/features/health"
	"github.com/ritho/habit-tracker/backend-go/internal/features/journal"
)

type Handlers struct {
	Health  health.Handler
	Auth    auth.Handler
	Habits  habits.Handler
	Journal journal.Handler
}

func Register(r chi.Router, basePath string, h Handlers, requireAuth func(http.Handler) http.Handler) {
	r.Route(basePath, func(api chi.Router) {
		api.Get("/health", h.Health.GetHealth)
		api.Post("/auth/register", h.Auth.Register)
		api.Post("/auth/login", h.Auth.Login)
		api.Post("/auth/logout", h.Auth.Logout)

		api.Group(func(protected chi.Router) {
			if requireAuth != nil {
				protected.Use(requireAuth)
			}

			protected.Get("/me", h.Auth.Me)

			protected.Route("/habits", func(habits chi.Router) {
				habits.Get("/", h.Habits.List)
				habits.Post("/", h.Habits.Create)
				habits.Patch("/{habitID}", h.Habits.Update)
			})

			protected.Route("/journal", func(journal chi.Router) {
				journal.Get("/", h.Journal.List)
				journal.Put("/{date}", h.Journal.Upsert)
			})
		})
	})
}
