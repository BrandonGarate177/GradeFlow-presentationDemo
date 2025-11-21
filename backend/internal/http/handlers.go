package http

import (
	"encoding/json"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/analysis"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/elevenlabs"
)

// GradePresentationHandler returns an http.HandlerFunc that handles the POST /grade-presentation
// endpoint.
func GradePresentationHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Parse multipart form
		if err := r.ParseMultipartForm(100 << 20); err != nil { // 100MB
			log.Printf("failed to parse multipart form: %v", err)
			http.Error(w, "invalid multipart form", http.StatusBadRequest)
			return
		}

		file, header, err := r.FormFile("audio")
		if err != nil {
			log.Printf("missing audio file: %v", err)
			http.Error(w, "audio file is required", http.StatusBadRequest)
			return
		}
		defer file.Close()

		// Save uploaded file to a temp location
		tmp, err := saveUploadedFile(file, header)
		if err != nil {
			log.Printf("failed to save uploaded file: %v", err)
			http.Error(w, "failed to save file", http.StatusInternalServerError)
			return
		}
		defer os.Remove(tmp)

		// TODO: Replace this with real ASR transcription
		transcript := "Dummy transcript of presentation"

		analysisRes, err := analysis.AnalyzePresentation(transcript)
		if err != nil {
			log.Printf("analysis failed: %v", err)
			http.Error(w, "analysis failed", http.StatusInternalServerError)
			return
		}

		// Generate model delivery audio via ElevenLabs
		audioURL, err := elevenlabs.GenerateModelDeliveryAudio(analysisRes.SuggestedScript, cfg)
		if err != nil {
			log.Printf("elevenlabs failed: %v", err)
			// Continue and return analysis without audio rather than failing completely
			audioURL = ""
		}

		// Build response
		resp := map[string]interface{}{
			"score_overall": analysisRes.ScoreOverall,
			"scores":        analysisRes.Scores,
			"transcript":    transcript,
			"feedback": map[string]interface{}{
				"summary":          analysisRes.Summary,
				"strengths":        analysisRes.Strengths,
				"areas_to_improve": analysisRes.AreasToImprove,
				"suggested_script": analysisRes.SuggestedScript,
			},
			"model_delivery_audio_url": audioURL,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			log.Printf("failed to write response: %v", err)
		}
	}
}

func saveUploadedFile(file multipart.File, header *multipart.FileHeader) (string, error) {
	tmp, err := os.CreateTemp("", "upload-*.webm")
	if err != nil {
		return "", err
	}
	defer tmp.Close()

	if _, err := io.Copy(tmp, file); err != nil {
		return "", err
	}
	return tmp.Name(), nil
}
