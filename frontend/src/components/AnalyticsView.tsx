"use client";

import React from "react";
import { TopicSummary } from "../types/study";

interface AnalyticsViewProps {
  topics: TopicSummary[];
}

export function AnalyticsView({ topics }: AnalyticsViewProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Study Analytics & Breakdown</h2>
      
      <div className="space-y-8">
        {topics.map((topic, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">{topic.name}</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Key Points to Master</h4>
              <ul className="list-disc pl-5 space-y-1">
                {topic.key_points.map((kp, kIdx) => (
                  <li key={kIdx} className="text-gray-700">{kp}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Mastery Status:</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-xs">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="text-xs text-gray-500">45%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
