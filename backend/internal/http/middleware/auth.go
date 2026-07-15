package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/ritho/habit-tracker/backend-go/internal/http/identity"
	"github.com/ritho/habit-tracker/backend-go/internal/http/respond"
)

type Claims struct {
	UserID string `json:"uid"`
	jwt.RegisteredClaims
}

func RequireJWT(secret string, issuer string, appEnv string) func(http.Handler) http.Handler {
	hmacSecret := []byte(secret)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := bearerToken(r.Header.Get("Authorization"))
			if tokenString == "" {
				if appEnv == "development" {
					ctx := identity.WithUserID(r.Context(), "dev-user")
					next.ServeHTTP(w, r.WithContext(ctx))
					return
				}

				respond.JSON(w, http.StatusUnauthorized, map[string]any{"message": "missing bearer token"})
				return
			}

			claims := &Claims{}
			token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, errors.New("unexpected signing method")
				}
				return hmacSecret, nil
			}, jwt.WithIssuer(issuer))
			if err != nil || !token.Valid || claims.UserID == "" {
				respond.JSON(w, http.StatusUnauthorized, map[string]any{"message": "invalid bearer token"})
				return
			}

			ctx := identity.WithUserID(r.Context(), claims.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func bearerToken(authorizationHeader string) string {
	if authorizationHeader == "" {
		return ""
	}

	parts := strings.SplitN(authorizationHeader, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return ""
	}

	return strings.TrimSpace(parts[1])
}
