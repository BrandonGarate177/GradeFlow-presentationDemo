package http

import (
	"net/http"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/presentation"
)

// RegisterRoutes registers http handlers on the provided ServeMux.
func RegisterRoutes(mux *http.ServeMux, grader *presentation.Grader) {
	// Wrap the handler with CORS middleware
	mux.Handle("/grade-presentation", CORSMiddleware(GradePresentationHandler(grader)))
}
