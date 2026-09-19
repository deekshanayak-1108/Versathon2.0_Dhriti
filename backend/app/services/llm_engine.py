import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.schemas.study import StudyKit

load_dotenv()

def generate_study_materials(text: str) -> StudyKit:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = f"""
    You are an expert educator. Convert these study notes into an active revision study kit.
    Please generate exactly:
    - 2 to 4 concise topics
    - 5 to 8 high-yield active-recall flashcards
    - 4 to 6 multiple-choice questions with answer explanations

    STUDY MATERIAL:
    \"\"\"
    {text}
    \"\"\"
    """

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=StudyKit,
            temperature=0.3,
        ),
    )

    return StudyKit.model_validate_json(response.text)

# Alias so both function names work across routes
generate_study_kit = generate_study_materials
