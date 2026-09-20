# Dhriti – Comprehensive Project Report

---

## 1. Executive Summary

**Dhriti** is a decoupled, full-stack AI-driven active recall study platform. It enables students and educators to transform unstructured educational materials—such as lecture slides, PDFs, syllabus notes, and transcripts—into structured, interactive revision study kits in seconds.

The platform automatically digests documents, extracts clean text, and utilizes advanced Large Language Models (LLMs) to synthesize:
- **Active Recall Flashcards** with front/back conceptual drills.
- **Diagnostic Multiple-Choice Quizzes** with distractor explanations and misconception tracking.
- **Topic-by-Topic Breakdown** with targeted mastery metrics and intelligent **Re-drill** capability.

---

## 2. System Architecture

The project is architected as a decoupled, modern full-stack web application:

```
┌─────────────────────────────────────────────────────────┐
│              Client Browser (User Interface)            │
│  - Next.js 14 (App Router) + React 18 + TypeScript      │
│  - Framer Motion (3D Card Flips & Micro-interactions)   │
│  - Tailwind CSS + Lucide Icons                          │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP REST API (JSON / FormData)
                             ▼
┌─────────────────────────────────────────────────────────┐
│             Backend Engine (FastAPI / Python)           │
│  - RESTful API Endpoints (CORS configured)              │
│  - PyPDF Document Ingestion & Text Sanitizer            │
│  - Pydantic v2 Type-Safe Schema Validation              │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Groq Cloud Engine                    │
│                 (openai/gpt-oss-120b)                   │
│         Ultra-low latency schema & JSON generation      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack & Tools

### 3.1 Frontend
| Technology / Package | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `14.2.3` | React framework with App Router, server/client decoupling, and performance optimization. |
| **React** | `^18.0.0` | Declarative UI rendering, hooks (`useState`, `useEffect`, `useCallback`), and modular components. |
| **TypeScript** | `^5.0.0` | End-to-end static typing ensuring strict data modeling matching backend schemas. |
| **Tailwind CSS** | `^3.4.19` | Utility-first CSS framework for modern, responsive, and responsive styling. |
| **Framer Motion** | `^11.0.0` | Smooth physics-based 3D flip card animations, exit/entry transitions, and responsive feedback. |
| **Lucide React** | `^0.300.0` | Modern SVG iconography for interactive UI controls and upload stages. |
| **PostCSS & Autoprefixer**| `^8.5.28` / `^10.6.1` | Cross-browser CSS transformation and automated vendor prefixing. |
| **clsx & tailwind-merge** | `^2.1.1` / `^3.7.0` | Utility tools for conditional class names and conflict resolution. |

### 3.2 Backend
| Technology / Package | Version / Tool | Purpose |
| :--- | :--- | :--- |
| **FastAPI** | Latest | Asynchronous Python web framework for fast, type-checked API endpoints. |
| **Uvicorn** | Standard | Lightning-fast ASGI production-ready server with auto-reloading during development. |
| **Pydantic** | `>=2.0` | Data validation, JSON Schema definition, and deserialization of LLM responses. |
| **PyPDF** | Latest | In-memory extraction of text streams from multi-page `.pdf` files. |
| **python-multipart** | Latest | Streaming and parsing of `multipart/form-data` uploads (files + form fields). |
| **python-dotenv** | Latest | Secure runtime environment variable management (`.env`). |

### 3.3 AI & LLM Infrastructure
| Technology | Model / SDK | Purpose |
| :--- | :--- | :--- |
| **Groq Cloud API** | `openai/gpt-oss-120b` via `groq` SDK | High-performance revision engine providing ultra-fast inference with strict JSON schema enforcement. |

### 3.4 Development & Operational Tools
- **Operating Environment**: Windows / PowerShell / Command Prompt
- **Package Managers**: `npm` (Node.js) & `pip` (Python Virtualenv)
- **Version Control**: Git
- **Interactive Documentation**: FastAPI Swagger UI (`/docs`) & ReDoc (`/redoc`)
- **Persistence Layer**: Browser `LocalStorage` for session state preservation across page reloads.

---

## 4. Key Application Features

### 4.1 Multi-Modal Document Ingestion (`UploadZone.tsx`)
- Supports direct file drag-and-drop or file browser selection for `.pdf` and `.txt`.
- Provides an alternative raw text textarea for lecture transcripts, syllabus outlines, or markdown notes.
- Integrated multi-stage loading feedback (`"Reading and parsing document..."` → `"Generating flashcards and diagnostic quiz with AI..."`).

### 4.2 Document Cleaning & Preprocessing (`parser.py`)
- Regex-based sanitizer collapses repeated line breaks (`\n{3,} → \n\n`), cleans non-printable ASCII control characters, and removes excessive whitespace.
- Text length guard ensuring at least 40 legible characters before querying the LLM to prevent wasteful API requests.

### 4.3 3D Interactive Flashcard Deck (`FlashcardDeck.tsx`)
- Realistic 3D card-flipping animation using CSS `perspective` and Framer Motion's `transformStyle: "preserve-3d"`.
- Keyboard navigation:
  - <kbd>Space</kbd>: Flip between question (front) and answer (back).
  - <kbd>←</kbd> (Left Arrow): Mark as "Need Practice" (re-queues card at the back of the deck).
  - <kbd>→</kbd> (Right Arrow): Mark as "Got It" (increments mastery count and dequeues).
- Real-time percentage progress bar and completion summary.

### 4.4 Diagnostic Quiz Arena (`QuizArena.tsx`)
- 4-option multiple choice format per question targeting student misconceptions.
- Instant validation highlighting correct answer in green and incorrect selections in red.
- Detailed conceptual explanations provided for every question upon answer submission.
- Real-time score aggregation segregated by individual topic.

### 4.5 Revision Analytics & Smart Re-Drill (`AnalyticsView.tsx`)
- Analyzes topic performance categorized into:
  - **Mastered** (≥ 75%)
  - **Needs Review** (50% – 74%)
  - **Critical Weak Spot** (< 50%)
- Lists bulleted "Key Points to Master" per topic.
- **Smart Re-Drill Button**: Dynamically filters the flashcard deck to focus exclusively on identified weak topics for targeted study sessions.

### 4.6 Offline State Persistence (`page.tsx`)
- Uses browser `localStorage` to retain the generated `StudyKit` and `quizScores`.
- Refreshing or reopening the browser instantly resumes the current revision session without re-running the AI model.
- Includes a dedicated "Start Over" button to clear session memory and load new material.

---

## 5. Data Models & API Specifications

### 5.1 JSON Data Schema (`StudyKit`)
The LLM engine guarantees structural output matching the following Pydantic schema:

```json
{
  "title": "Introduction to Machine Learning",
  "summary": "Overview of supervised vs unsupervised learning algorithms and evaluation metrics.",
  "topics": [
    {
      "name": "Supervised Learning",
      "key_points": [
        "Requires labeled training data",
        "Includes regression and classification tasks"
      ]
    }
  ],
  "flashcards": [
    {
      "id": "fc-1",
      "topic": "Supervised Learning",
      "front": "What is the primary difference between regression and classification?",
      "back": "Regression predicts continuous numeric values, whereas classification assigns inputs to discrete category labels."
    }
  ],
  "quiz": [
    {
      "id": "q-1",
      "topic": "Supervised Learning",
      "question": "Which of the following is a classification task?",
      "options": [
        "Predicting house prices",
        "Filtering email as spam or not spam",
        "Estimating tomorrow's temperature",
        "Clustering customer purchase habits"
      ],
      "correct_index": 1,
      "explanation": "Spam filtering assigns an email into discrete classes (spam or not spam), making it a classification problem. The others are regression or clustering."
    }
  ]
}
```

### 5.2 API Routes

| HTTP Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Root Health Check | None | `{"status": "Backend running"}` |
| `POST` | `/api/process` | Document processing & study kit generation | `multipart/form-data`: `file` (optional) or `raw_text` (optional) | `StudyKit` JSON object |

---

## 6. How to Run the Project

### Prerequisites
- **Node.js**: v18+ 
- **Python**: v3.10+
- **API Key**: Groq API Key (`gsk_...`)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
3. Ensure `.env` is configured:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Ensure `.env.local` is present:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Future Roadmap & Enhancements

1. **Spaced Repetition Algorithm (SM-2 / Anki)**: Introduce interval-based scheduling to optimize long-term memory retention.
2. **Audio Lecture Transcription**: Integrate Whisper API for direct MP3/WAV lecture audio uploads.
3. **Export Formats**: Allow export of generated study kits directly to Anki decks (`.apkg`) or PDF revision sheets.
4. **User Authentication & Cloud Storage**: Enable user profiles (Supabase/Firebase) to synchronize decks across multiple devices.
