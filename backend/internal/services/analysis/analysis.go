package analysis

import (
	"context"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/models"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/llm"
)

type Service struct {
	llmClient *llm.Client
}

func NewService() *Service {
	return &Service{
		llmClient: llm.NewClient(),
	}
}

// AnalyzePresentation analyzes presentation transcript using LLM.
func (s *Service) AnalyzePresentation(ctx context.Context, transcript string) (*models.AnalysisResult, error) {
	return s.llmClient.AnalyzePresentation(ctx, transcript)
}

// Legacy function for backward compatibility
func AnalyzePresentation(transcript string) (*models.AnalysisResult, error) {
	service := NewService()
	return service.AnalyzePresentation(context.Background(), transcript)
}
