package transcription

import (
	"context"
	"log"
	"mime/multipart"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
)

// FallbackTranscriber tries ElevenLabs first, then falls back to dummy if it fails
type FallbackTranscriber struct {
	primary  *ElevenLabsTranscriber
	fallback *DummyTranscriber
}

// NewFallbackTranscriber creates a new fallback transcriber
func NewFallbackTranscriber(cfg *config.Config) *FallbackTranscriber {
	return &FallbackTranscriber{
		primary:  NewElevenLabsTranscriber(cfg),
		fallback: NewDummyTranscriber(),
	}
}

// Transcribe attempts ElevenLabs transcription first, falling back to dummy on failure
func (f *FallbackTranscriber) Transcribe(ctx context.Context, audio multipart.File) (string, error) {
	// Try ElevenLabs first
	transcript, err := f.primary.Transcribe(ctx, audio)
	if err != nil {
		log.Printf("ElevenLabs transcription failed, falling back to dummy: %v", err)
		return f.fallback.Transcribe(ctx, audio)
	}

	log.Printf("Successfully transcribed audio using ElevenLabs: %d characters", len(transcript))
	return transcript, nil
}
