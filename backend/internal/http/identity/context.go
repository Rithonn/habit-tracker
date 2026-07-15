package identity

import "context"

type contextKey string

const userIDContextKey contextKey = "user_id"

func WithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userIDContextKey, userID)
}

func UserID(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(userIDContextKey).(string)
	if !ok || userID == "" {
		return "", false
	}

	return userID, true
}

func UserIDOrDefault(ctx context.Context, fallback string) string {
	if userID, ok := UserID(ctx); ok {
		return userID
	}

	return fallback
}
