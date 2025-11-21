package transcription

import (
	"testing"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
)

func TestNewElevenLabsTranscriber(t *testing.T) {
	cfg := &config.Config{
		ElevenLabsAPIKey: "test-key",
	}

	transcriber := NewElevenLabsTranscriber(cfg)
	if transcriber == nil {
		t.Fatal("Expected transcriber to be created")
	}

	if transcriber.apiKey != "test-key" {
		t.Errorf("Expected API key to be 'test-key', got '%s'", transcriber.apiKey)
	}
}

func TestNewFallbackTranscriber(t *testing.T) {
	cfg := &config.Config{
		ElevenLabsAPIKey: "test-key",
	}

	transcriber := NewFallbackTranscriber(cfg)
	if transcriber == nil {
		t.Fatal("Expected fallback transcriber to be created")
	}

	if transcriber.primary == nil {
		t.Error("Expected primary transcriber to be set")
	}

	if transcriber.fallback == nil {
		t.Error("Expected fallback transcriber to be set")
	}
}
