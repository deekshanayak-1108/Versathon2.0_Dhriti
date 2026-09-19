"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Flashcard } from "../types/study";
import { motion } from "framer-motion";

interface FlashcardDeckProps {
  flashcards: Flashcard[];
}

export function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Initialize deck when flashcards change
  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      setQueue([...flashcards]);
      setTotalCount(flashcards.length);
      setMasteredCount(0);
      setIsFlipped(false);
    }
  }, [flashcards]);

  const handleNeedPractice = useCallback(() => {
    if (queue.length === 0) return;
    setIsFlipped(false);
    setQueue(prev => {
      const newQueue = [...prev];
      const current = newQueue.shift();
      if (current) newQueue.push(current);
      return newQueue;
    });
  }, [queue]);

  const handleMastered = useCallback(() => {
    if (queue.length === 0) return;
    setIsFlipped(false);
    setQueue(prev => {
      const newQueue = [...prev];
      newQueue.shift();
      return newQueue;
    });
    setMasteredCount(prev => prev + 1);
  }, [queue]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (queue.length === 0) return;
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handleNeedPractice();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleMastered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [queue.length, handleFlip, handleNeedPractice, handleMastered]);

  if (!flashcards || flashcards.length === 0) return null;

  if (queue.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-12 bg-white rounded-xl shadow border text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Deck Complete! 🎉</h2>
        <p className="text-gray-600 mb-8">You have mastered all {totalCount} cards in this deck.</p>
        <button 
          onClick={() => {
            setQueue([...flashcards]);
            setMasteredCount(0);
            setIsFlipped(false);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Restart Deck
        </button>
      </div>
    );
  }

  const currentCard = queue[0];
  const progressPercent = Math.round((masteredCount / totalCount) * 100);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8">
      <div className="w-full">
        <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
          <span>{progressPercent}% Mastered</span>
          <span>{masteredCount} / {totalCount} Cards</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
        Topic: {currentCard.topic}
      </div>

      <div 
        className="w-full h-96 perspective-1000 relative cursor-pointer"
        onClick={handleFlip}
      >
        <motion.div
          className="w-full h-full preserve-3d"
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border p-8 flex items-center justify-center text-center hover:border-blue-300 transition-colors">
            <h3 className="text-3xl font-medium text-gray-800">{currentCard.front}</h3>
          </div>
          
          {/* Back */}
          <div 
            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-200 p-8 flex flex-col items-center justify-center text-center"
            style={{ transform: "rotateX(180deg)" }}
          >
            <p className="text-xl text-gray-700 leading-relaxed overflow-y-auto max-h-full p-2">{currentCard.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <button 
          onClick={handleNeedPractice}
          className="flex flex-col items-center py-4 px-6 rounded-xl border-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <span className="font-bold text-lg mb-1">Need Practice</span>
          <span className="text-xs opacity-75">Press Left Arrow ←</span>
        </button>
        <button 
          onClick={handleMastered}
          className="flex flex-col items-center py-4 px-6 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <span className="font-bold text-lg mb-1">Got It</span>
          <span className="text-xs opacity-75">Press Right Arrow →</span>
        </button>
      </div>
      <div className="text-sm text-gray-400">
        Press <kbd className="px-2 py-1 bg-gray-100 rounded border font-mono">Space</kbd> to flip
      </div>
    </div>
  );
}
