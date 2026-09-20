import { StudyKit } from "../types/study";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function processStudyMaterial({ file, text }: { file?: File | null; text?: string }): Promise<StudyKit> {
  let body: BodyInit;
  let headers: HeadersInit = {};

  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  if (text) {
    formData.append("raw_text", text);
  }
  body = formData;

  const response = await fetch(`${API_BASE_URL}/api/process`, {
    method: "POST",
    body,
    headers,
  });

  if (!response.ok) {
    let errorText = "";
    try {
      errorText = await response.text();
    } catch (e) {
      errorText = "No additional error details provided.";
    }
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
