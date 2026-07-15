package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/ritho/habit-tracker/backend-go/internal/config"
	"github.com/ritho/habit-tracker/backend-go/internal/http/handlers"
	"github.com/ritho/habit-tracker/backend-go/internal/http/routes"
)

type Server struct {
	Router http.Handler
}

func New(cfg config.Config) Server {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.CORSAllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	h := handlers.New()
	routes.Register(r, cfg.APIBasePath, h)

	return Server{Router: r}
}
