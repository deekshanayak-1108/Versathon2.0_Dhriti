"use client";

import React, { useState, ChangeEvent, DragEvent } from "react";
import { UploadCloud, FileText, Loader2, Sparkles } from "lucide-react";
import { StudyKit } from "@/types/study";
import { processStudyMaterial } from "../lib/api";

interface UploadZoneProps {
  onSuccess?: (data: StudyKit) => void;
  onProcessComplete?: (data: StudyKit) => void;
  onProcessStart?: () => void;
  onError?: (err: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onSuccess,
  onProcessComplete,
  onProcessStart,
  onError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile && !rawText.trim()) {
      const msg = "Please upload a PDF/text file or paste your lecture notes.";
      setErrorMsg(msg);
      onError?.(msg);
      return;
    }

    setErrorMsg(null);
    setLoadingStage("Reading and parsing document...");
    onProcessStart?.();

    try {
      setTimeout(() => {
        setLoadingStage("Generating flashcards and diagnostic quiz with AI...");
      }, 1500);

      const kit = await processStudyMaterial({
        file: selectedFile,
        text: rawText.trim()
      });

      onSuccess?.(kit);
      onProcessComplete?.(kit);
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setErrorMsg(msg);
      onError?.(msg);
    } finally {
      setLoadingStage(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Generate Study Revision Kit</h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload class notes or paste lecture summaries to construct active recall decks.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${
          isDragOver ? "border-indigo-500 bg-indigo-50/40" : "border-slate-300 hover:border-slate-400"
        }`}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileInput}
        />
        <UploadCloud className="w-10 h-10 text-indigo-600 mb-2" />
        <p className="text-sm font-medium text-slate-700">
          {selectedFile ? selectedFile.name : "Click to select or drag a .pdf / .txt file here"}
        </p>
        <span className="text-xs text-slate-400 mt-1">Max standard lecture length</span>
      </div>

      <div className="relative my-4 text-center">
        <span className="bg-white px-2 text-xs text-slate-400 uppercase tracking-wider relative z-10">
          Or paste notes
        </span>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
      </div>

      <textarea
        rows={4}
        placeholder="Paste your syllabus notes, markdown summary, or transcript here..."
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 resize-none"
      />

      {errorMsg && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loadingStage !== null}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition disabled:opacity-50"
      >
        {loadingStage ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">{loadingStage}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Study Module</span>
          </>
        )}
      </button>
    </div>
  );
};