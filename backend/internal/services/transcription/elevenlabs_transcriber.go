package transcription

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
)

// ElevenLabsTranscriber implements transcription using ElevenLabs Speech-to-Text API
type ElevenLabsTranscriber struct {
	apiKey string
}

// NewElevenLabsTranscriber creates a new ElevenLabs transcriber
func NewElevenLabsTranscriber(cfg *config.Config) *ElevenLabsTranscriber {
	return &ElevenLabsTranscriber{
		apiKey: cfg.ElevenLabsAPIKey,
	}
}

// ElevenLabsSTTResponse represents the response from ElevenLabs STT API
type ElevenLabsSTTResponse struct {
	Text string `json:"text"`
}

// Transcribe converts audio to text using ElevenLabs Speech-to-Text
func (e *ElevenLabsTranscriber) Transcribe(ctx context.Context, audio multipart.File) (string, error) {
	if e.apiKey == "" {
		log.Printf("ElevenLabs API key not configured")
		return "", fmt.Errorf("ElevenLabs API key not configured")
	}

	log.Printf("Starting ElevenLabs transcription...")

	// Reset file pointer to beginning
	if _, err := audio.Seek(0, 0); err != nil {
		return "", fmt.Errorf("failed to reset audio file: %w", err)
	}

	// Read audio data
	audioData, err := io.ReadAll(audio)
	if err != nil {
		return "", fmt.Errorf("failed to read audio data: %w", err)
	}

	log.Printf("Audio file size: %d bytes", len(audioData))

	// Create multipart form for ElevenLabs API
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	// Add audio file with correct field name
	part, err := writer.CreateFormFile("file", "audio.mp4")
	if err != nil {
		return "", fmt.Errorf("failed to create form file: %w", err)
	}

	if _, err := part.Write(audioData); err != nil {
		return "", fmt.Errorf("failed to write audio data: %w", err)
	}

	// Add model parameter (corrected field name)
	if err := writer.WriteField("model_id", "scribe_v1"); err != nil {
		return "", fmt.Errorf("failed to write model field: %w", err)
	}

	writer.Close()

	// Create HTTP request
	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.elevenlabs.io/v1/speech-to-text", &body)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("xi-api-key", e.apiKey)

	log.Printf("Making request to ElevenLabs API with model_id: eleven_multilingual_v2")

	// Make request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Request failed: %v", err)
		return "", fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	log.Printf("Received response with status: %d", resp.StatusCode)

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Printf("ElevenLabs API error (status %d): %s", resp.StatusCode, string(bodyBytes))
		return "", fmt.Errorf("ElevenLabs API error (status %d): %s", resp.StatusCode, string(bodyBytes))
	}

	// Parse response
	var sttResponse ElevenLabsSTTResponse
	if err := json.NewDecoder(resp.Body).Decode(&sttResponse); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if sttResponse.Text == "" {
		return "", fmt.Errorf("received empty transcript from ElevenLabs")
	}

	log.Printf("Successfully transcribed audio: %d characters", len(sttResponse.Text))
	return sttResponse.Text, nil
}
