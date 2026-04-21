"use client";

import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Read analysis result from session storage (populated by RecordingInterface)
    const stored = sessionStorage.getItem("latestSession");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      // Fallback demo result if directly navigated
      setResult({
        score: 78,
        wpm: 124,
        pauses: 4,
        fillers: 3,
        mistake: "You used filler words like 'um' and 'like' frequently when transitioning between points.",
        improvement: "Tomorrow, try taking a short silent breath instead of using a filler word when you need a moment to think."
      });
    }
  }, []);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center pt-24 space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500">Loading your results...</p>
      </div>
    );
  }

  let scoreColor = "text-amber-500";
  if (result.score >= 80) scoreColor = "text-emerald-500";
  else if (result.score < 60) scoreColor = "text-rose-500";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto pt-6 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-sm font-semibold tracking-widest text-gray-500 uppercase">Session Complete</h2>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Your Daily Analysis</h1>
      </div>

      <div className="w-full bg-white border border-gray-100 rounded-3xl shadow-sm p-8 sm:p-12">
        {/* Score Section */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative flex items-center justify-center w-48 h-48 rounded-full border-8 border-gray-50 mb-6 shadow-inner">
            <span className={`text-6xl font-black ${scoreColor}`}>
              {result.score}
            </span>
            <span className="absolute bottom-6 text-gray-400 text-sm font-medium">/ 100</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Fluency Score</h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-12 border-y border-gray-100 py-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-900">{result.wpm}</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">WPM</span>
          </div>
          <div className="flex flex-col items-center border-l border-r border-gray-100">
            <span className="text-3xl font-bold text-gray-900">{result.pauses}</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Pauses</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-900">{result.fillers}</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Fillers</span>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 relative overflow-hidden group">
            <h4 className="text-rose-800 font-bold mb-2 flex items-center gap-2">
              <span className="bg-rose-200 text-rose-800 p-1 rounded-full text-xs">⚠️</span>
              One Mistake
            </h4>
            <p className="text-rose-900 text-sm leading-relaxed relative z-10">
              {result.mistake}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden group">
            <h4 className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
              <span className="bg-emerald-200 text-emerald-800 p-1 rounded-full text-xs">🎯</span>
              Tomorrow's Focus
            </h4>
            <p className="text-emerald-900 text-sm leading-relaxed font-medium relative z-10">
              {result.improvement}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Check className="w-5 h-5" />
            <span>Done for today</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
