package http

import (
	"net/http"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/presentation"
)

// RegisterRoutes registers http handlers on the provided ServeMux.
func RegisterRoutes(mux *http.ServeMux, grader *presentation.Grader) {
	mux.Handle("/grade-presentation", GradePresentationHandler(grader))
}
