"use client";

import React, { useState } from "react";
import { QuizQuestion } from "../types/study";
import { motion, AnimatePresence } from "framer-motion";

interface QuizArenaProps {
  quiz: QuizQuestion[];
  onFinish: (scoresByTopic: Record<string, { correct: number; total: number }>) => void;
}

export function QuizArena({ quiz, onFinish }: QuizArenaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scores, setScores] = useState<Record<string, { correct: number; total: number }>>({});

  if (!quiz || quiz.length === 0) return null;

  const currentQ = quiz[currentIndex];
  const isCorrect = selectedOption === currentQ.correct_index;

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    
    setIsAnswered(true);
    
    setScores(prev => {
      const newScores = { ...prev };
      if (!newScores[currentQ.topic]) {
        newScores[currentQ.topic] = { correct: 0, total: 0 };
      }
      newScores[currentQ.topic].total += 1;
      if (selectedOption === currentQ.correct_index) {
        newScores[currentQ.topic].correct += 1;
      }
      return newScores;
    });
  };

  const handleNext = () => {
    if (currentIndex === quiz.length - 1) {
      onFinish(scores);
    } else {
      setIsAnswered(false);
      setSelectedOption(null);
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex justify-between items-center text-sm text-gray-500 mb-8 border-b pb-4">
        <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Question {currentIndex + 1} of {quiz.length}
        </span>
        <span className="font-medium">Topic: {currentQ.topic}</span>
      </div>

      <h3 className="text-2xl font-medium mb-8 text-gray-800 leading-relaxed">{currentQ.question}</h3>

      <div className="space-y-4 mb-8">
        {currentQ.options.map((opt, idx) => {
          let btnClass = "border-gray-200 hover:bg-gray-50 text-gray-700";
          
          if (isAnswered) {
            if (idx === currentQ.correct_index) {
              btnClass = "bg-green-50 border-green-500 text-green-800 ring-2 ring-green-500 ring-opacity-50";
            } else if (idx === selectedOption) {
              btnClass = "bg-red-50 border-red-500 text-red-800";
            } else {
              btnClass = "opacity-40 border-gray-200";
            }
          } else if (idx === selectedOption) {
            btnClass = "border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500 ring-opacity-50";
          }

          return (
            <button
              key={idx}
              onClick={() => { if (!isAnswered) setSelectedOption(idx); }}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${btnClass}`}
              disabled={isAnswered}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border mr-4 font-bold shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-lg">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {!isAnswered ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-md"
            >
              Submit Answer
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border-2 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className={`text-2xl ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "✅" : "❌"}
              </span>
              <p className={`font-bold text-xl ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">{currentQ.explanation}</p>
            
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              {currentIndex === quiz.length - 1 ? "View Results" : "Next Question"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
