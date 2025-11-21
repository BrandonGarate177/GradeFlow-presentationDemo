package llm

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/models"
	"github.com/sashabaranov/go-openai"
)

type Client struct {
	client *openai.Client
}

func NewClient() *Client {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		// For development, you can set a default or handle this gracefully
		fmt.Println("Warning: OPENAI_API_KEY not set, using mock responses")
	}

	return &Client{
		client: openai.NewClient(apiKey),
	}
}

type LLMAnalysisResponse struct {
	ScoreOverall    float64  `json:"score_overall"`
	Clarity         float64  `json:"clarity"`
	Structure       float64  `json:"structure"`
	Delivery        float64  `json:"delivery"`
	Pacing          float64  `json:"pacing"`
	FillerWords     float64  `json:"filler_words"`
	Summary         string   `json:"summary"`
	Strengths       []string `json:"strengths"`
	AreasToImprove  []string `json:"areas_to_improve"`
	SuggestedScript string   `json:"suggested_script"`
}

func (c *Client) AnalyzePresentation(ctx context.Context, transcript string) (*models.AnalysisResult, error) {
	if c.client == nil || os.Getenv("OPENAI_API_KEY") == "" {
		return c.mockAnalysis(), nil
	}

	prompt := fmt.Sprintf(`Analyze the following presentation transcript and provide a comprehensive evaluation. 

IMPORTANT: Return your response as a valid JSON object only. Do not include any markdown formatting, code blocks, or additional text.

Return exactly this JSON structure:

{
  "score_overall": 85.0,
  "clarity": 88.0,
  "structure": 82.0,
  "delivery": 87.0,
  "pacing": 84.0,
  "filler_words": 79.0,
  "summary": "Brief overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "areas_to_improve": ["improvement 1", "improvement 2"],
  "suggested_script": "Suggested improved version of key parts"
}

Scoring criteria (0-100):
- Clarity: How clear and understandable is the content?
- Structure: How well organized is the presentation?
- Delivery: How engaging and confident is the speaker?
- Pacing: How appropriate is the speaking speed and rhythm?
- Filler Words: How effectively does the speaker avoid filler words? (higher score = fewer fillers)

Transcript:
%s`, transcript)

	resp, err := c.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT4oMini,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are an expert presentation coach. Analyze presentations and provide constructive feedback with specific, actionable suggestions. Always respond with valid JSON only, no markdown formatting or code blocks.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			Temperature: 0.3,
		},
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get LLM response: %w", err)
	}

	if len(resp.Choices) == 0 {
		return nil, fmt.Errorf("no response from LLM")
	}

	content := resp.Choices[0].Message.Content

	// Clean the response - remove markdown code blocks if present
	cleanContent := cleanJSONResponse(content)

	var llmResp LLMAnalysisResponse
	if err := json.Unmarshal([]byte(cleanContent), &llmResp); err != nil {
		return nil, fmt.Errorf("failed to parse LLM response: %w\nRaw content: %s", err, content)
	} // Convert to our internal model
	result := &models.AnalysisResult{
		ScoreOverall: llmResp.ScoreOverall,
		Scores: models.ScoreBreakdown{
			Clarity:     llmResp.Clarity,
			Structure:   llmResp.Structure,
			Delivery:    llmResp.Delivery,
			Pacing:      llmResp.Pacing,
			FillerWords: llmResp.FillerWords,
		},
		Summary:         llmResp.Summary,
		Strengths:       llmResp.Strengths,
		AreasToImprove:  llmResp.AreasToImprove,
		SuggestedScript: llmResp.SuggestedScript,
	}

	return result, nil
}

// mockAnalysis provides a fallback when API key is not available
func (c *Client) mockAnalysis() *models.AnalysisResult {
	return &models.AnalysisResult{
		ScoreOverall: 82.0,
		Scores: models.ScoreBreakdown{
			Clarity:     82.0,
			Structure:   76.0,
			Delivery:    90.0,
			Pacing:      88.0,
			FillerWords: 64.0,
		},
		Summary:         "Strong content but pacing is a bit fast; consider pausing after key points. (Using mock data - set OPENAI_API_KEY for LLM analysis)",
		Strengths:       []string{"Clear explanation of key points", "Good structure"},
		AreasToImprove:  []string{"Slow down during the intro", "More vocal variety"},
		SuggestedScript: "Today I'm going to walk you through the main ideas and show how they connect...",
	}
}

// cleanJSONResponse removes markdown code block formatting from LLM responses
func cleanJSONResponse(content string) string {
	// Remove leading/trailing whitespace
	content = strings.TrimSpace(content)

	// Remove markdown code block markers if present
	if strings.HasPrefix(content, "```json") {
		content = strings.TrimPrefix(content, "```json")
	} else if strings.HasPrefix(content, "```") {
		content = strings.TrimPrefix(content, "```")
	}

	// Remove closing code block marker
	content = strings.TrimSuffix(content, "```")

	// Remove any remaining leading/trailing whitespace
	return strings.TrimSpace(content)
}
