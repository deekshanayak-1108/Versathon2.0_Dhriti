import io
from pypdf import PdfReader

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    else:
        # Assume it's a text file like .txt or .md
        return file_bytes.decode("utf-8", errors="ignore")
