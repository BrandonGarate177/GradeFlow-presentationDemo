package models

type AnalysisResult struct {
	ScoreOverall    float64        `json:"score_overall"`
	Scores          ScoreBreakdown `json:"scores"`
	Summary         string         `json:"summary"`
	Strengths       []string       `json:"strengths"`
	AreasToImprove  []string       `json:"areas_to_improve"`
	SuggestedScript string         `json:"suggested_script"`
}

type ScoreBreakdown struct {
	Clarity     float64 `json:"clarity"`
	Structure   float64 `json:"structure"`
	Delivery    float64 `json:"delivery"`
	Pacing      float64 `json:"pacing"`
	FillerWords float64 `json:"filler_words"`
}
