package models

type AnalysisResult struct {
	ScoreOverall    int            `json:"score_overall"`
	Scores          map[string]int `json:"scores"`
	Summary         string         `json:"summary"`
	Strengths       []string       `json:"strengths"`
	AreasToImprove  []string       `json:"areas_to_improve"`
	SuggestedScript string         `json:"suggested_script"`
}
