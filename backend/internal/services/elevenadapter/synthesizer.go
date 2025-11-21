package elevenadapter

import (
	"context"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/elevenlabs"
)

// ElevenLabsSynthesizer wraps the ElevenLabs service to implement the SpeechSynthesizer interface
type ElevenLabsSynthesizer struct {
	cfg *config.Config
}

// NewElevenLabsSynthesizer creates a new ElevenLabs synthesizer
func NewElevenLabsSynthesizer(cfg *config.Config) *ElevenLabsSynthesizer {
	return &ElevenLabsSynthesizer{cfg: cfg}
}

// Synthesize converts text to speech using ElevenLabs API and returns a public URL to the audio
func (e *ElevenLabsSynthesizer) Synthesize(ctx context.Context, text string) (string, error) {
	// Ignore ctx for now if underlying function doesn't use it
	return elevenlabs.GenerateModelDeliveryAudio(text, e.cfg)
}
