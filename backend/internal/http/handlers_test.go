package http

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/analysisadapter"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/presentation"
	"github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/services/transcription"
)

func createTestGrader() *presentation.Grader {
	transcriber := transcription.NewDummyTranscriber()
	analyzer := analysisadapter.NewAnalyzerAdapter()
	return presentation.NewGrader(transcriber, analyzer)
}

func TestGradePresentationHandler_MissingFile(t *testing.T) {
	grader := createTestGrader()
	handler := GradePresentationHandler(grader)

	req := httptest.NewRequest(http.MethodPost, "/grade-presentation", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for missing multipart form, got %d", rec.Code)
	}
}

func TestGradePresentationHandler_BasicUpload(t *testing.T) {
	// Create a multipart body with an audio file field (empty file)
	var b bytes.Buffer
	w := multipart.NewWriter(&b)
	part, _ := w.CreateFormFile("audio", "test.webm")
	part.Write([]byte("dummy audio"))
	w.Close()

	grader := createTestGrader()
	handler := GradePresentationHandler(grader)

	req := httptest.NewRequest(http.MethodPost, "/grade-presentation", &b)
	req.Header.Set("Content-Type", w.FormDataContentType())
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d, body: %s", rec.Code, rec.Body.String())
	}
}
