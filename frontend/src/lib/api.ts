import { StudyKit } from "../types/study";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function processStudyMaterial(payload: FormData | { text: string }): Promise<StudyKit> {
  let body: BodyInit;
  let headers: HeadersInit = {};

  if (payload instanceof FormData) {
    body = payload;
    // Let browser set Content-Type for FormData
  } else {
    const formData = new FormData();
    formData.append("text", payload.text);
    body = formData;
  }

  const response = await fetch(`${API_URL}/process`, {
    method: "POST",
    body,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
