package http

import (
    "net/http"

    "github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
)

// RegisterRoutes registers http handlers on the provided ServeMux.
func RegisterRoutes(mux *http.ServeMux, cfg *config.Config) {
    mux.HandleFunc("/grade-presentation", GradePresentationHandler(cfg))

    // Serve audio files from ./public/audio at /audio/
    fs := http.FileServer(http.Dir("public/audio"))
    mux.Handle("/audio/", http.StripPrefix("/audio/", fs))
}
