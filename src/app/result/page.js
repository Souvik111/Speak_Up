"use client";

import Link from 'next/link';
import { Check, Loader2, Zap, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

function AnimatedScore({ score, color }) {
  const [displayScore, setDisplayScore] = useState(0);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference * (1 - score / 100);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  let gradientStart = "#8b5cf6";
  let gradientEnd = "#22d3ee";
  if (score >= 80) { gradientStart = "#10b981"; gradientEnd = "#22d3ee"; }
  else if (score < 60) { gradientStart = "#f43f5e"; gradientEnd = "#f97316"; }

  return (
    <div className="relative w-48 h-48 animate-count-up">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="80" cy="80" r="70"
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-ring-fill"
          style={{ '--ring-offset': offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-6xl font-black ${color}`}>
          {displayScore}
        </span>
        <span className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>/ 100</span>
      </div>
    </div>
  );
}

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
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full animate-spin-slow"
               style={{ background: 'conic-gradient(from 0deg, transparent, #8b5cf6, #22d3ee, transparent)', mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)' }}>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your results...</p>
      </div>
    );
  }

  let scoreColor = "text-amber-400";
  if (result.score >= 80) scoreColor = "text-emerald-400";
  else if (result.score < 60) scoreColor = "text-rose-400";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto pt-6 pb-12">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <span className="gradient-pill inline-block px-3 py-1 mb-3">Session Complete</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight gradient-text">Your Daily Analysis</h1>
      </div>

      <div className="w-full glass-card p-8 sm:p-12 animate-fade-in-up-delay-1">
        {/* Score Section */}
        <div className="flex flex-col items-center justify-center mb-12">
          <AnimatedScore score={result.score} color={scoreColor} />
          <h3 className="text-lg font-bold mt-4" style={{ color: 'var(--text-primary)' }}>Fluency Score</h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          <div className="glass-card-sm p-5 flex flex-col items-center text-center">
            <Zap className="w-4 h-4 mb-2 text-violet-400" />
            <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{result.wpm}</span>
            <span className="text-xs uppercase tracking-widest font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>WPM</span>
          </div>
          <div className="glass-card-sm p-5 flex flex-col items-center text-center">
            <Clock className="w-4 h-4 mb-2 text-indigo-400" />
            <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{result.pauses}</span>
            <span className="text-xs uppercase tracking-widest font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Pauses</span>
          </div>
          <div className="glass-card-sm p-5 flex flex-col items-center text-center">
            <AlertCircle className="w-4 h-4 mb-2 text-cyan-400" />
            <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{result.fillers}</span>
            <span className="text-xs uppercase tracking-widest font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>Fillers</span>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="space-y-4">
          <div className="feedback-card-rose p-6">
            <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2 text-sm">
              <span>⚠️</span>
              One Mistake
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {result.mistake}
            </p>
          </div>

          <div className="feedback-card-emerald p-6">
            <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2 text-sm">
              <span>🎯</span>
              Tomorrow&apos;s Focus
            </h4>
            <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
              {result.improvement}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex justify-center">
          <Link 
            href="/"
            className="glow-button inline-flex items-center justify-center gap-2 px-10 py-4 font-semibold text-white"
          >
            <Check className="w-5 h-5" />
            <span>Done for today</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
