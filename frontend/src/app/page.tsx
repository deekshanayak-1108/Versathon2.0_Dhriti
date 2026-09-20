"use client";

import { useState, useEffect } from "react";
import { StudyKit } from "../types/study";
import { UploadZone } from "../components/UploadZone";
import { FlashcardDeck } from "../components/FlashcardDeck";
import { QuizArena } from "../components/QuizArena";
import { AnalyticsView } from "../components/AnalyticsView";

export default function Home() {
  const [studyKit, setStudyKit] = useState<StudyKit | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"flashcards" | "quiz" | "analytics">("flashcards");
  const [quizScores, setQuizScores] = useState<Record<string, { correct: number; total: number }>>({});
  const [redrillTopics, setRedrillTopics] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedKit = localStorage.getItem("studyKit");
    const savedScores = localStorage.getItem("quizScores");
    if (savedKit) {
      try {
        setStudyKit(JSON.parse(savedKit));
      } catch (e) {
        console.error("Failed to parse saved study kit");
      }
    }
    if (savedScores) {
      try {
        setQuizScores(JSON.parse(savedScores));
      } catch (e) {
        console.error("Failed to parse saved quiz scores");
      }
    }
  }, []);

  useEffect(() => {
    if (studyKit) {
      localStorage.setItem("studyKit", JSON.stringify(studyKit));
    } else {
      localStorage.removeItem("studyKit");
    }
  }, [studyKit]);

  useEffect(() => {
    if (Object.keys(quizScores).length > 0) {
      localStorage.setItem("quizScores", JSON.stringify(quizScores));
    } else {
      localStorage.removeItem("quizScores");
    }
  }, [quizScores]);

  const handleQuizComplete = (scoresByTopic: Record<string, { correct: number; total: number }>) => {
    setQuizScores(scoresByTopic);
    setActiveView("analytics");
  };

  const handleRedrill = (topicsToReview: string[]) => {
    setRedrillTopics(topicsToReview);
    setActiveView("flashcards");
  };

  const handleStartOver = () => {
    setStudyKit(null);
    setQuizScores({});
    setRedrillTopics([]);
    localStorage.removeItem("studyKit");
    localStorage.removeItem("quizScores");
  };

  if (!isClient) return null; // Avoid hydration mismatch

  if (!studyKit) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Dhriti
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Upload your lecture slides, PDFs, or raw notes and instantly generate a comprehensive study kit.
          </p>
        </div>

        <UploadZone 
          onSuccess={(data) => { setIsProcessing(false); setStudyKit(data); }}
          onProcessStart={() => { setIsProcessing(true); setError(null); }}
          onProcessComplete={(data) => { setIsProcessing(false); setStudyKit(data); }}
          onError={(err) => { setIsProcessing(false); setError(err); }}
        />
        
        {isProcessing && (
          <div className="mt-8 text-center text-blue-600 flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing document and generating AI study kit...</span>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg max-w-xl text-center">
            {error}
          </div>
        )}
      </main>
    );
  }

  const flashcardsToDisplay = redrillTopics.length > 0 
    ? studyKit.flashcards.filter(f => redrillTopics.includes(f.topic))
    : studyKit.flashcards;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{studyKit.title}</h1>
            <p className="text-sm text-gray-500 truncate max-w-md">{studyKit.summary}</p>
          </div>
          <button 
            onClick={handleStartOver}
            className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded px-4 py-2 transition-colors"
          >
            Start Over
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <nav className="flex space-x-8 justify-center sm:justify-start">
            {["flashcards", "quiz", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveView(tab as any);
                  if (tab !== "flashcards") setRedrillTopics([]); // Reset redrill when leaving flashcards
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeView === tab 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        {activeView === "flashcards" && (
          <div className="w-full">
             {redrillTopics.length > 0 && (
                <div className="mb-6 text-center text-orange-600 font-medium bg-orange-50 p-3 rounded-lg border border-orange-200 max-w-2xl mx-auto">
                  Currently in Re-drill mode for: {redrillTopics.join(", ")}
                </div>
             )}
             <FlashcardDeck flashcards={flashcardsToDisplay} />
          </div>
        )}
        {activeView === "quiz" && <QuizArena quiz={studyKit.quiz} onFinish={handleQuizComplete} />}
        {activeView === "analytics" && <AnalyticsView topics={studyKit.topics} quizScores={quizScores} onRedrill={handleRedrill} />}
      </main>
    </div>
  );
}
