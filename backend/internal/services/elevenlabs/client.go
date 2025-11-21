package elevenlabs

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "path/filepath"
    "time"

    "github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
)

// GenerateModelDeliveryAudio calls ElevenLabs TTS API and saves the returned audio
// to public/audio/<file>.mp3. Returns a public URL to the saved file.
func GenerateModelDeliveryAudio(text string, cfg *config.Config) (string, error) {
    if cfg.ElevenLabsAPIKey == "" || cfg.ElevenLabsVoiceID == "" {
        return "", fmt.Errorf("elevenlabs api key or voice id not configured")
    }

    endpoint := fmt.Sprintf("https://api.elevenlabs.io/v1/text-to-speech/%s", cfg.ElevenLabsVoiceID)

    body := map[string]interface{}{
        "text": text,
        "model": "eleven_multilingual_v2",
        "voice_settings": map[string]interface{}{
            "stability": 0.5,
            "similarity_boost": 0.75,
        },
    }
    b, _ := json.Marshal(body)

    req, err := http.NewRequest("POST", endpoint, bytes.NewReader(b))
    if err != nil {
        return "", err
    }
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("xi-api-key", cfg.ElevenLabsAPIKey)
    // Request audio/mpeg response where supported
    req.Header.Set("Accept", "audio/mpeg")

    client := &http.Client{Timeout: 60 * time.Second}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        // Try to read response body for error message
        msg, _ := io.ReadAll(resp.Body)
        return "", fmt.Errorf("elevenlabs API error: %d %s", resp.StatusCode, string(msg))
    }

    audioBytes, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }

    // Save to public/audio
    fname := fmt.Sprintf("model_delivery_%d.mp3", time.Now().UnixNano())
    outPath := filepath.Join("public", "audio", fname)
    if err := os.WriteFile(outPath, audioBytes, 0o644); err != nil {
        return "", err
    }

    // Ensure no trailing slash
    base := cfg.BackendURL
    if len(base) > 0 && base[len(base)-1] == '/' {
        base = base[:len(base)-1]
    }

    publicURL := fmt.Sprintf("%s/audio/%s", base, fname)
    return publicURL, nil
}
