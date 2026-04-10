package middleware

import "net/http"

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Server", "GymManagementAPI")
		next.ServeHTTP(w, r)
	})
}
