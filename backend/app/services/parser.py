import io
import re
from pypdf import PdfReader

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    text = ""
    if filename.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            text += page.extract_text() + "\n"
    else:
        # Assume it's a text file like .txt or .md
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            text = file_bytes.decode("latin-1", errors="ignore")
            
    # Clean up excessive whitespace or blank lines
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()
