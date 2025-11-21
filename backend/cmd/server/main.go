package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
	httpinternal "github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/http"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/analysisadapter"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/presentation"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/transcription"
)

func main() {
	cfg := config.Load()

	// Initialize all services using dependency injection
	transcriber := transcription.NewFallbackTranscriber(cfg)
	analyzer := analysisadapter.NewAnalyzerAdapter()

	// Create the presentation grader with all dependencies
	grader := presentation.NewGrader(transcriber, analyzer)

	// Setup HTTP routes
	mux := http.NewServeMux()
	httpinternal.RegisterRoutes(mux, grader)

	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	log.Printf("starting server at %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
