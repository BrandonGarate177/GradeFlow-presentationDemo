package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Host              string
	Port              string
	BackendURL        string
	ElevenLabsAPIKey  string
	ElevenLabsVoiceID string
}

func Load() *Config {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found or error loading it: %v", err)
	}

	cfg := &Config{
		Port:             getEnv("PORT", "8080"),
		Host:             getEnv("HOST", "0.0.0.0"),
		BackendURL:       getEnv("BACKEND_URL", "http://localhost:8080"),
		ElevenLabsAPIKey: os.Getenv("ELEVENLABS_API_KEY"),
		// ElevenLabsVoiceID: os.Getenv("ELEVENLABS_VOICE_ID"),
	}

	// Better logging - secure and informative
	if cfg.ElevenLabsAPIKey != "" {
		log.Printf("ElevenLabs API key loaded (length: %d)", len(cfg.ElevenLabsAPIKey))
	} else {
		log.Printf("ElevenLabs API key not found - using fallback transcriber")
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
