package presentation

import (
	"context"
	"mime/multipart"
)

type ScoreBreakdown struct {
	Clarity     float64 `json:"clarity"`
	Structure   float64 `json:"structure"`
	Delivery    float64 `json:"delivery"`
	Pacing      float64 `json:"pacing"`
	FillerWords float64 `json:"filler_words"`
}

type GradeResult struct {
	Transcript   string         `json:"transcript"`
	ScoreOverall float64        `json:"score_overall"`
	Scores       ScoreBreakdown `json:"scores"`

	Summary         string   `json:"summary"`
	Strengths       []string `json:"strengths"`
	AreasToImprove  []string `json:"areas_to_improve"`
	SuggestedScript string   `json:"suggested_script"`
}

type GradeRequest struct {
	AudioFile multipart.File
	// Optionally extend later with: AssignmentID, RubricID, Language, etc.
}

// Transcriber interface for converting audio to text
type Transcriber interface {
	Transcribe(ctx context.Context, audio multipart.File) (string, error)
}

// Analyzer interface for analyzing transcripts and generating scores/feedback
type Analyzer interface {
	Analyze(ctx context.Context, transcript string) (*GradeResult, error)
}
