# Frontend (Next.js + TypeScript + Tailwind)

How to run:

1. Copy environment variables into `.env.local` in this folder (or set globally):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

2. Install and run:

```bash
npm ci
npm run dev
```

Notes/TODOs:
- Replace the SLIDE_ID placeholder in `src/components/SlidesViewer.tsx` with your published Google Slides id.
- This scaffold uses `MediaRecorder` to capture `audio/webm` and uploads it to `/grade-presentation`.
- The actual ASR and LLM logic lives on the backend (placeholders there).
