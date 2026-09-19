"use client";

import React, { useState } from "react";
import { Flashcard } from "../types/study";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardDeckProps {
  flashcards: Flashcard[];
}

export function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());

  if (!flashcards || flashcards.length === 0) return null;

  const currentCard = flashcards[currentIndex];
  const isMastered = mastered.has(currentCard.id);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleMastery = () => {
    setMastered((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentCard.id)) {
        newSet.delete(currentCard.id);
      } else {
        newSet.add(currentCard.id);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between w-full text-sm text-gray-500 mb-2">
        <span>Topic: {currentCard.topic}</span>
        <span>{currentIndex + 1} / {flashcards.length}</span>
      </div>

      <div 
        className="w-full h-80 perspective-1000 relative cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border p-8 flex items-center justify-center text-center">
            <h3 className="text-2xl font-medium text-gray-800">{currentCard.front}</h3>
          </div>
          
          {/* Back */}
          <div 
            className="absolute w-full h-full backface-hidden bg-blue-50 rounded-2xl shadow-xl border-blue-200 p-8 flex items-center justify-center text-center"
            style={{ transform: "rotateY(180deg)" }}
          >
            <p className="text-xl text-gray-700">{currentCard.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center space-x-4 w-full">
        <button onClick={handlePrev} className="p-2 px-4 rounded bg-gray-100 hover:bg-gray-200">Prev</button>
        <div className="flex-1 flex justify-center space-x-4">
            <button 
                onClick={toggleMastery}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isMastered 
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-orange-100 text-orange-700 border border-orange-300"
                }`}
            >
                {isMastered ? "✓ Mastered" : "Need Practice"}
            </button>
        </div>
        <button onClick={handleNext} className="p-2 px-4 rounded bg-gray-100 hover:bg-gray-200">Next</button>
      </div>
    </div>
  );
}
