package transcription

import (
	"context"
	"mime/multipart"
)

// DummyTranscriber is a placeholder implementation that returns a hardcoded transcript
type DummyTranscriber struct{}

// NewDummyTranscriber creates a new dummy transcriber
func NewDummyTranscriber() *DummyTranscriber {
	return &DummyTranscriber{}
}

// Transcribe returns a dummy transcript for any audio input
func (d *DummyTranscriber) Transcribe(ctx context.Context, audio multipart.File) (string, error) {
	// TODO: later replace with real ASR (ElevenLabs, Whisper, etc.)
	return "Dummy transcript of presentation", nil
}
