package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/ritho/habit-tracker/backend-go/internal/config"
	"github.com/ritho/habit-tracker/backend-go/internal/features/auth"
	"github.com/ritho/habit-tracker/backend-go/internal/features/habits"
	"github.com/ritho/habit-tracker/backend-go/internal/features/health"
	"github.com/ritho/habit-tracker/backend-go/internal/features/journal"
	apiMiddleware "github.com/ritho/habit-tracker/backend-go/internal/http/middleware"
	"github.com/ritho/habit-tracker/backend-go/internal/http/routes"
	"github.com/rs/zerolog"
)

type Server struct {
	Router http.Handler
}

func New(cfg config.Config, logger zerolog.Logger) Server {
	r := chi.NewRouter()
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(apiMiddleware.RequestLogger(logger))
	r.Use(chimiddleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.CORSAllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	healthHandler := health.NewHandler()

	authRepo := auth.NewMemoryRepository()
	authService := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authService)

	habitsRepo := habits.NewMemoryRepository()
	habitsService := habits.NewService(habitsRepo)
	habitsHandler := habits.NewHandler(habitsService)

	journalRepo := journal.NewMemoryRepository()
	journalService := journal.NewService(journalRepo)
	journalHandler := journal.NewHandler(journalService)
	jwtAuth := apiMiddleware.RequireJWT(cfg.JWTSecret, cfg.JWTIssuer, cfg.AppEnv)

	routes.Register(r, cfg.APIBasePath, routes.Handlers{
		Health:  healthHandler,
		Auth:    authHandler,
		Habits:  habitsHandler,
		Journal: journalHandler,
	}, jwtAuth)

	return Server{Router: r}
}
