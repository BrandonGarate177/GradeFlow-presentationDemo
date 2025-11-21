package http

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/presentation"
)

// GradePresentationHandler returns an http.HandlerFunc that handles the POST /grade-presentation
// endpoint using the provided Grader service.
func GradePresentationHandler(grader *presentation.Grader) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		if err := r.ParseMultipartForm(100 << 20); err != nil { // 100MB
			log.Printf("failed to parse multipart form: %v", err)
			http.Error(w, "invalid multipart form", http.StatusBadRequest)
			return
		}

		file, _, err := r.FormFile("audio")
		if err != nil {
			log.Printf("missing audio file: %v", err)
			http.Error(w, "audio file is required", http.StatusBadRequest)
			return
		}
		defer file.Close()

		res, err := grader.GradePresentation(r.Context(), presentation.GradeRequest{
			AudioFile: file,
		})
		if err != nil {
			log.Printf("grade failed: %v", err)
			http.Error(w, "grading failed", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			log.Printf("failed to write response: %v", err)
		}
	}
}
