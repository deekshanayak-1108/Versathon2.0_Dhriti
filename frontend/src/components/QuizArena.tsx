"use client";

import React, { useState } from "react";
import { QuizQuestion } from "../types/study";
import { motion } from "framer-motion";

interface QuizArenaProps {
  quiz: QuizQuestion[];
}

export function QuizArena({ quiz }: QuizArenaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz || quiz.length === 0) return null;

  const currentQ = quiz[currentIndex];
  const isCorrect = selectedOption === currentQ.correct_index;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.correct_index) setScore(s => s + 1);
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentIndex(prev => prev + 1);
  };

  if (currentIndex >= quiz.length) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-xl shadow text-center">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">Your Score: {score} / {quiz.length}</p>
        <button 
          onClick={() => { setCurrentIndex(0); setScore(0); setIsAnswered(false); setSelectedOption(null); }}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border">
      <div className="flex justify-between text-sm text-gray-500 mb-6 border-b pb-4">
        <span>Question {currentIndex + 1} of {quiz.length}</span>
        <span>Topic: {currentQ.topic}</span>
      </div>

      <h3 className="text-xl font-medium mb-6">{currentQ.question}</h3>

      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => {
          let btnClass = "border-gray-200 hover:bg-gray-50";
          if (isAnswered) {
            if (idx === currentQ.correct_index) {
              btnClass = "bg-green-100 border-green-500 text-green-800";
            } else if (idx === selectedOption) {
              btnClass = "bg-red-100 border-red-500 text-red-800";
            } else {
              btnClass = "opacity-50 border-gray-200";
            }
          } else if (idx === selectedOption) {
            btnClass = "border-blue-500 bg-blue-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${btnClass}`}
              disabled={isAnswered}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"}`}
        >
          <p className="font-semibold mb-1">{isCorrect ? "Correct!" : "Incorrect"}</p>
          <p className="text-sm">{currentQ.explanation}</p>
          
          <button 
            onClick={handleNext}
            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            {currentIndex === quiz.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
