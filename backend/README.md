# Backend (Go)

How to run locally:

1. Set environment variables (see root `.env.example`) or export them in your shell.

2. From the `backend/` folder:

```bash
go build ./cmd/server
./server
```

This will start an HTTP server on the port configured by `PORT` (default 8080).

Notes/TODOs:
- `GenerateModelDeliveryAudio` calls the ElevenLabs Text-to-Speech API — you must set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`.
- ASR (speech-to-text) and LLM analysis are placeholders for now.
- For production consider using persistent storage (S3) instead of local `public/audio/`.
