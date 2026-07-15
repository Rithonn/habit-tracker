package config

import "os"

type Config struct {
	AppEnv             string
	Port               string
	APIBasePath        string
	DatabaseURL        string
	JWTSecret          string
	JWTIssuer          string
	CORSAllowedOrigins []string
}

func Load() Config {
	return Config{
		AppEnv:             envOrDefault("APP_ENV", "development"),
		Port:               envOrDefault("PORT", "8080"),
		APIBasePath:        envOrDefault("API_BASE_PATH", "/api/v1"),
		DatabaseURL:        envOrDefault("DATABASE_URL", ""),
		JWTSecret:          envOrDefault("JWT_SECRET", "dev-secret-change-me"),
		JWTIssuer:          envOrDefault("JWT_ISSUER", "habit-tracker"),
		CORSAllowedOrigins: splitCSV(envOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:4200")),
	}
}

func envOrDefault(name, fallback string) string {
	if value := os.Getenv(name); value != "" {
		return value
	}
	return fallback
}

func splitCSV(input string) []string {
	result := make([]string, 0)
	current := ""

	for _, char := range input {
		if char == ',' {
			if current != "" {
				result = append(result, trimWhitespace(current))
			}
			current = ""
			continue
		}
		current += string(char)
	}

	if current != "" {
		result = append(result, trimWhitespace(current))
	}

	if len(result) == 0 {
		return []string{"*"}
	}

	return result
}

func trimWhitespace(input string) string {
	start := 0
	end := len(input)

	for start < end && (input[start] == ' ' || input[start] == '\t') {
		start++
	}

	for end > start && (input[end-1] == ' ' || input[end-1] == '\t') {
		end--
	}

	return input[start:end]
}
