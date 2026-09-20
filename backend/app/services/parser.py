import io
import re
from fastapi import HTTPException, UploadFile
from pypdf import PdfReader

def clean_text(raw_text: str) -> str:
    """Strip repeated newlines, excessive spacing, and common artifacts."""
    # Collapse multiple blank lines or page breaks
    cleaned = re.sub(r"\n{3,}", "\n\n", raw_text)
    # Strip non-printable/null control characters
    cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", cleaned)
    # Normalize excessive horizontal whitespace
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    return cleaned.strip()

async def extract_text_from_file(file: UploadFile) -> str:
    """Extract and validate text from .txt and .pdf files."""
    filename = file.filename or ""
    contents = await file.read()

    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    extracted_text = ""

    if filename.lower().endswith(".txt"):
        try:
            extracted_text = contents.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = contents.decode("latin-1", errors="ignore")

    elif filename.lower().endswith(".pdf"):
        try:
            pdf_stream = io.BytesIO(contents)
            reader = PdfReader(pdf_stream)
            pages_text = []

            for index, page in enumerate(reader.pages):
                page_content = page.extract_text() or ""
                # Omit empty extracted pages
                if page_content.strip():
                    pages_text.append(page_content)

            extracted_text = "\n\n".join(pages_text)
        except Exception as exc:
            raise HTTPException(status_code=422, detail=f"Failed to parse PDF document: {str(exc)}")
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a .pdf or .txt document.",
        )

    sanitized = clean_text(extracted_text)
    if len(sanitized) < 40:
        raise HTTPException(
            status_code=422,
            detail="The document does not contain sufficient legible text for study generation.",
        )

    return sanitized