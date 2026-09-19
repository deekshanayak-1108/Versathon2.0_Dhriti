from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.schemas.study import StudyKit
from app.services.parser import extract_text_from_file
from app.services.llm_engine import generate_study_kit

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "OK"}

@router.post("/process", response_model=StudyKit)
async def process_study_material(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    raw_text = ""
    if file:
        file_bytes = await file.read()
        raw_text = extract_text_from_file(file_bytes, file.filename)
    elif text:
        raw_text = text
    else:
        raise HTTPException(status_code=400, detail="Must provide either text or a file.")
        
    if not raw_text.strip():
         raise HTTPException(status_code=400, detail="Extracted text is empty.")
         
    try:
        study_kit = generate_study_kit(raw_text)
        return study_kit
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating study kit: {str(e)}")
