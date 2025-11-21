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
	log.Println("Starting GradeFlow backend server...")

	cfg := config.Load()
	log.Printf("Configuration loaded: Host=%s, Port=%s", cfg.Host, cfg.Port)

	// Initialize all services using dependency injection
	log.Println("Initializing transcriber...")
	transcriber := transcription.NewFallbackTranscriber(cfg)

	log.Println("Initializing analyzer...")
	analyzer := analysisadapter.NewAnalyzerAdapter()

	// Create the presentation grader with all dependencies
	log.Println("Creating presentation grader...")
	grader := presentation.NewGrader(transcriber, analyzer)

	// Setup HTTP routes
	log.Println("Setting up HTTP routes...")
	mux := http.NewServeMux()
	httpinternal.RegisterRoutes(mux, grader)

	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	log.Printf("Server starting on %s", addr)
	log.Printf("Health check available at: http://%s/health", addr)

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
