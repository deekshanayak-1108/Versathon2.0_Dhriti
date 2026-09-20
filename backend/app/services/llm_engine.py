import json
import os
from app.schemas.study import StudyKit

def _generate_with_groq(api_key: str, source_text: str) -> StudyKit:
    import groq

    client = groq.Groq(api_key=api_key)
    schema = json.dumps(StudyKit.model_json_schema())

    system_instruction = (
        "You are an active recall revision engine. Analyze raw educational text and generate "
        "a structured study kit.\n"
        f"You MUST return valid JSON adhering strictly to this JSON schema:\n{schema}\n\n"
        "Rules:\n"
        "1. Flashcards: Focus on core definitions, relationships, and concepts. Keep the front clear "
        "and back concise. Provide unique ids like 'fc-1', 'fc-2'.\n"
        "2. Quiz Questions: Multi-choice questions must have exactly 4 plausible options. Provide unique ids like 'q-1'. "
        "Each option should target common student misconceptions. 'correct_index' must be an integer (0, 1, 2, or 3). "
        "Explain clearly why the correct option is accurate and why the other options are wrong.\n"
        "3. Topics: Group both flashcards and questions under explicit topic names for analytics categorization.\n"
        "4. Output only valid raw JSON matching the schema."
    )

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": f"Source Material:\n{source_text}"},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("Groq LLM returned an empty response.")

    return StudyKit.model_validate_json(content)

def _generate_with_gemini(api_key: str, source_text: str) -> StudyKit:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    system_instruction = (
        "You are an active recall revision engine. Analyze raw educational text and generate "
        "a structured study kit. Rules:\n"
        "1. Flashcards: Focus on core definitions, relationships, and concepts. Keep the front clear "
        "and back concise.\n"
        "2. Quiz Questions: Multi-choice questions must have exactly 4 plausible distractors. "
        "Each distractor should target common student misconceptions. Explain clearly why the correct "
        "index is accurate and why the other options are wrong.\n"
        "3. Topics: Group both flashcards and questions under explicit topic names for analytics categorization."
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[system_instruction, f"Source Material:\n{source_text}"],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=StudyKit,
            temperature=0.2,
        ),
    )

    if not response.text:
        raise RuntimeError("Gemini LLM returned an empty response.")

    return StudyKit.model_validate_json(response.text)

def generate_study_kit_from_notes(source_text: str) -> StudyKit:
    groq_key = os.getenv("GROQ_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    # If key starts with gsk_, it is a Groq key
    if groq_key and groq_key.startswith("gsk_"):
        return _generate_with_groq(groq_key, source_text)
    if gemini_key and gemini_key.startswith("gsk_"):
        return _generate_with_groq(gemini_key, source_text)

    # If gemini key is provided
    if gemini_key:
        return _generate_with_gemini(gemini_key, source_text)

    if groq_key:
        return _generate_with_groq(groq_key, source_text)

    raise RuntimeError("Missing API key. Please set GROQ_API_KEY or GEMINI_API_KEY in your .env file.")