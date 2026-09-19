"use client";

import React from "react";
import { TopicSummary } from "../types/study";

interface AnalyticsViewProps {
  topics: TopicSummary[];
  quizScores: Record<string, { correct: number; total: number }>;
  onRedrill: (topicsToReview: string[]) => void;
}

export function AnalyticsView({ topics, quizScores, onRedrill }: AnalyticsViewProps) {
  if (!topics || topics.length === 0) return null;

  const weakTopics: string[] = [];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex justify-between items-end mb-8 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Revision Analytics</h2>
          <p className="text-gray-500">Based on your recent quiz performance</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {topics.map((topic, idx) => {
          const scoreData = quizScores[topic.name];
          let percentage = 0;
          let hasData = false;

          if (scoreData && scoreData.total > 0) {
            percentage = Math.round((scoreData.correct / scoreData.total) * 100);
            hasData = true;
          }

          let tagClass = "bg-gray-100 text-gray-800 border-gray-200";
          let tagText = "No Data";

          if (hasData) {
            if (percentage >= 75) {
              tagClass = "bg-green-100 text-green-800 border-green-300";
              tagText = "Mastered";
            } else if (percentage >= 50) {
              tagClass = "bg-yellow-100 text-yellow-800 border-yellow-300";
              tagText = "Needs Review";
              weakTopics.push(topic.name);
            } else {
              tagClass = "bg-red-100 text-red-800 border-red-300";
              tagText = "Critical Weak Spot";
              weakTopics.push(topic.name);
            }
          } else {
            weakTopics.push(topic.name); // If they didn't even see it, it might need review
          }

          return (
            <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-200 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex-1">{topic.name}</h3>
                <span className={`px-4 py-1 rounded-full text-sm font-bold border ${tagClass}`}>
                  {tagText}
                </span>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Key Points to Master</h4>
                <ul className="space-y-2">
                  {topic.key_points.map((kp, kIdx) => (
                    <li key={kIdx} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700 leading-relaxed">{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600 min-w-[120px]">
                  {hasData ? `Score: ${scoreData.correct} / ${scoreData.total}` : "Not tested yet"}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      percentage >= 75 ? "bg-green-500" : percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${hasData ? percentage : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 w-12 text-right">
                  {hasData ? `${percentage}%` : "-"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-8 border-t flex justify-center">
        <button 
          onClick={() => onRedrill(weakTopics)}
          disabled={weakTopics.length === 0}
          className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {weakTopics.length > 0 ? `Re-drill ${weakTopics.length} Weak Topics` : "You've Mastered Everything!"}
        </button>
      </div>
    </div>
  );
}
