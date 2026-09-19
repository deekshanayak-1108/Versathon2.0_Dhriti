"use client";

import React, { useState } from "react";

interface UploadZoneProps {
  onProcessStart: () => void;
  onProcessComplete: (data: any) => void;
  onError: (error: string) => void;
}

export function UploadZone({ onProcessStart, onProcessComplete, onError }: UploadZoneProps) {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    onProcessStart();
    try {
      const { processStudyMaterial } = await import("../lib/api");
      let studyKit;

      if (activeTab === "file" && file) {
        studyKit = await processStudyMaterial({ file });
      } else if (activeTab === "text" && text) {
        studyKit = await processStudyMaterial({ text });
      } else {
        throw new Error("Please provide a file or text content.");
      }
      onProcessComplete(studyKit);
    } catch (err: any) {
      onError(err.message || "Failed to process material");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex space-x-4 mb-6 border-b pb-2">
        <button
          className={`pb-2 px-4 ${activeTab === "file" ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-500"}`}
          onClick={() => setActiveTab("file")}
        >
          Upload PDF
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "text" ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-500"}`}
          onClick={() => setActiveTab("text")}
        >
          Paste Notes
        </button>
      </div>

      {activeTab === "file" ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept=".pdf,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      ) : (
        <textarea
          className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Paste your raw notes or study text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      <button
        onClick={handleUpload}
        className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={activeTab === "file" ? !file : !text}
      >
        Generate Study Kit
      </button>
    </div>
  );
}
