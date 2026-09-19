export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface TopicSummary {
  name: string;
  key_points: string[];
}

export interface StudyKit {
  title: string;
  summary: string;
  topics: TopicSummary[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}
