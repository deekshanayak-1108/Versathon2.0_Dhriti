from pydantic import BaseModel

class Flashcard(BaseModel):
    id: str
    topic: str
    front: str
    back: str

class QuizQuestion(BaseModel):
    id: str
    topic: str
    question: str
    options: list[str]
    correct_index: int
    explanation: str

class TopicSummary(BaseModel):
    name: str
    key_points: list[str]

class StudyKit(BaseModel):
    title: str
    summary: str
    topics: list[TopicSummary]
    flashcards: list[Flashcard]
    quiz: list[QuizQuestion]
