"use client";

import { useState } from "react";
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

  if (!studyKit) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Versathon <span className="text-blue-600">2.0</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Upload your lecture slides, PDFs, or raw notes and instantly generate a comprehensive study kit.
          </p>
        </div>

        <UploadZone 
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{studyKit.title}</h1>
            <p className="text-sm text-gray-500 truncate max-w-md">{studyKit.summary}</p>
          </div>
          <button 
            onClick={() => setStudyKit(null)}
            className="text-sm text-gray-500 hover:text-gray-900 border rounded px-3 py-1"
          >
            Start Over
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {["flashcards", "quiz", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveView(tab as any)}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeView === "flashcards" && <FlashcardDeck flashcards={studyKit.flashcards} />}
        {activeView === "quiz" && <QuizArena quiz={studyKit.quiz} />}
        {activeView === "analytics" && <AnalyticsView topics={studyKit.topics} />}
      </main>
    </div>
  );
}
