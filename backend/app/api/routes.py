from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from typing import Optional
from app.services.parser import extract_text_from_file, clean_text
from app.services.llm_engine import generate_study_kit_from_notes
from app.schemas.study import StudyKit

router = APIRouter()

@router.post("/process", response_model=StudyKit)
async def process_study_notes(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
):
    text_content = ""

    if file and file.filename:
        text_content = await extract_text_from_file(file)
    elif raw_text and raw_text.strip():
        text_content = clean_text(raw_text)
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either a document file (.pdf, .txt) or paste raw text notes.",
        )

    try:
        study_kit = generate_study_kit_from_notes(text_content)
        return study_kit
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(exc)}")