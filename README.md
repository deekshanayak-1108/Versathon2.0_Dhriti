# Versathon 2.0

A full-stack, decoupled AI-powered study platform.

## Architecture
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python), Pydantic, Gemini API (GenAI)

## Setup Instructions

### Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   ```
3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your API Key:
   Rename `.env.example` to `.env` and add your `GEMINI_API_KEY`.
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables:
   Rename `.env.example` to `.env.local` if you need to point the API to a different host.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage
Upload a PDF or paste notes directly into the web UI. The backend will parse the input and utilize Google Gemini to construct a structured JSON `StudyKit`, populating the React frontend with flashcards, quizzes, and a topic breakdown.
