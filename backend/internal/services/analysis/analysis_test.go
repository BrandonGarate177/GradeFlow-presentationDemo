package analysis

import (
	"context"
	"testing"
)

func TestAnalyzePresentation(t *testing.T) {
	service := NewService()

	transcript := "Hello everyone, today I will be presenting about artificial intelligence and machine learning. AI is becoming increasingly important in our daily lives. Let me explain the key concepts."

	result, err := service.AnalyzePresentation(context.Background(), transcript)
	if err != nil {
		t.Fatalf("AnalyzePresentation failed: %v", err)
	}

	if result == nil {
		t.Fatal("AnalyzePresentation returned nil result")
	}

	// Verify the result has expected fields
	if result.ScoreOverall < 0 || result.ScoreOverall > 100 {
		t.Errorf("ScoreOverall should be between 0-100, got %f", result.ScoreOverall)
	}

	if result.Summary == "" {
		t.Error("Summary should not be empty")
	}

	if len(result.Strengths) == 0 {
		t.Error("Strengths should not be empty")
	}

	if len(result.AreasToImprove) == 0 {
		t.Error("AreasToImprove should not be empty")
	}
}

func TestLegacyAnalyzePresentation(t *testing.T) {
	transcript := "Test presentation about technology trends."

	result, err := AnalyzePresentation(transcript)
	if err != nil {
		t.Fatalf("Legacy AnalyzePresentation failed: %v", err)
	}

	if result == nil {
		t.Fatal("Legacy AnalyzePresentation returned nil result")
	}

	// Should return a valid analysis
	if result.ScoreOverall <= 0 {
		t.Error("ScoreOverall should be positive")
	}
}
