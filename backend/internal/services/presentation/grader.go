package presentation

import (
	"context"
)

// Grader orchestrates the presentation grading pipeline
type Grader struct {
	transcriber Transcriber
	analyzer    Analyzer
}

// NewGrader creates a new presentation grader with the provided services
func NewGrader(t Transcriber, a Analyzer) *Grader {
	return &Grader{
		transcriber: t,
		analyzer:    a,
	}
}

// GradePresentation executes the full presentation grading pipeline
func (g *Grader) GradePresentation(ctx context.Context, req GradeRequest) (*GradeResult, error) {
	// TODO 1. Transcribe the audio
	transcript, err := g.transcriber.Transcribe(ctx, req.AudioFile)
	if err != nil {
		return nil, err
	}

	// TODO 2. Analyze the transcript
	result, err := g.analyzer.Analyze(ctx, transcript)
	if err != nil {
		return nil, err
	}

	return result, nil
}
