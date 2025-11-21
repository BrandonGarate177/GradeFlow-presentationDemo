package analysisadapter

import (
	"context"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/analysis"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/presentation"
)

// AnalyzerAdapter wraps the existing analysis service to implement the Analyzer interface
type AnalyzerAdapter struct {
	analysisService *analysis.Service
}

// NewAnalyzerAdapter creates a new analyzer adapter
func NewAnalyzerAdapter() *AnalyzerAdapter {
	return &AnalyzerAdapter{
		analysisService: analysis.NewService(),
	}
}

// Analyze processes a transcript and returns grading results
func (a *AnalyzerAdapter) Analyze(ctx context.Context, transcript string) (*presentation.GradeResult, error) {
	res, err := a.analysisService.AnalyzePresentation(ctx, transcript)
	if err != nil {
		return nil, err
	}

	// Convert the analysis result to the presentation format
	return &presentation.GradeResult{
		Transcript:   transcript,
		ScoreOverall: res.ScoreOverall,
		Scores: presentation.ScoreBreakdown{
			Clarity:     res.Scores.Clarity,
			Structure:   res.Scores.Structure,
			Delivery:    res.Scores.Delivery,
			Pacing:      res.Scores.Pacing,
			FillerWords: res.Scores.FillerWords,
		},
		Summary:         res.Summary,
		Strengths:       res.Strengths,
		AreasToImprove:  res.AreasToImprove,
		SuggestedScript: res.SuggestedScript,
	}, nil
}
