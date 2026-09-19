import os
from google import genai
from pydantic import BaseModel
from app.schemas.study import StudyKit

def generate_study_kit(raw_text: str) -> StudyKit:
    # Initialize the client. The API key should be set in the environment as GEMINI_API_KEY
    client = genai.Client()
    
    prompt = f"""
    You are an expert educational content creator. Based on the following study material,
    generate a comprehensive study kit including a summary, key topics, flashcards, and a quiz.
    
    Study Material:
    {raw_text}
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": StudyKit,
            "temperature": 0.2
        },
    )
    
    return StudyKit.model_validate_json(response.text)
