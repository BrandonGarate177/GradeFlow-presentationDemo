export interface GradePresentationResponse {
  score_overall: number;
  scores: {
    clarity: number;
    pacing: number;
    confidence: number;
    structure: number;
  };
  transcript: string;
  feedback: {
    summary: string;
    strengths: string[];
    areas_to_improve: string[];
    suggested_script: string;
  };
  model_delivery_audio_url: string;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function gradePresentation(file: Blob): Promise<GradePresentationResponse> {
  const fd = new FormData();
  fd.append("audio", file, "presentation.webm");

  const res = await fetch(`${BACKEND}/grade-presentation`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }
  const json = await res.json();
  return json as GradePresentationResponse;
}
