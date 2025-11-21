package config

import (
    "os"
)

type Config struct {
    Host             string
    Port             string
    BackendURL       string
    ElevenLabsAPIKey string
    ElevenLabsVoiceID string
}

func Load() *Config {
    cfg := &Config{
        Host: getEnv("HOST", "0.0.0.0"),
        Port: getEnv("PORT", "8080"),
        BackendURL: getEnv("BACKEND_URL", "http://localhost:8080"),
        ElevenLabsAPIKey: os.Getenv("ELEVENLABS_API_KEY"),
        ElevenLabsVoiceID: os.Getenv("ELEVENLABS_VOICE_ID"),
    }
    return cfg
}

func getEnv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
