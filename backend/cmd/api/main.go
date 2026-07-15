package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ritho/habit-tracker/backend-go/internal/config"
	"github.com/ritho/habit-tracker/backend-go/internal/server"
	"github.com/rs/zerolog"
)

func main() {
	cfg := config.Load()
	logger := zerolog.New(os.Stdout).With().Timestamp().Str("service", "habit-tracker-api").Logger()
	srv := server.New(cfg, logger)

	httpServer := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           srv.Router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		logger.Info().Str("port", cfg.Port).Msg("api listening")
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal().Err(err).Msg("listen and serve failed")
		}
	}()

	shutdownSignal := make(chan os.Signal, 1)
	signal.Notify(shutdownSignal, os.Interrupt, syscall.SIGTERM)
	<-shutdownSignal

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := httpServer.Shutdown(ctx); err != nil {
		logger.Error().Err(err).Msg("graceful shutdown failed")
	}
}
