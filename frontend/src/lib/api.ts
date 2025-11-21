export interface GradePresentationResponse {
  score_overall: number;
  scores: {
    clarity: number;
    structure: number;
    delivery: number;
    pacing: number;
    filler_words: number;
  };
  transcript: string;
  summary: string;
  strengths: string[];
  areas_to_improve: string[];
  suggested_script: string;
}

const BACKEND = "https://gradeflow-backend-931693461442.us-west1.run.app"; 

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
