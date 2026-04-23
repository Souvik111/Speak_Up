"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const TOTAL_TIME = 60;
const RING_CIRCUMFERENCE = 2 * Math.PI * 70; // radius = 70

export default function RecordingInterface({ topicId }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      stopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimeLeft(TOTAL_TIME);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to use this feature.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      
      const res = await fetch("/api/analyze", { 
        method: "POST", 
        body: formData 
      });
      
      if (!res.ok) throw new Error("Analysis failed");
      
      const data = await res.json();
      sessionStorage.setItem("latestSession", JSON.stringify(data));
      
      // Attempt to save to Supabase history (fail silently if not setup)
      try {
        const { supabase } = await import('@/lib/supabase');
        if (supabase) {
          await supabase.from('sessions').insert({
             topic_id: topicId,
             transcript: data.transcript,
             fluency_score: data.score,
             pauses: data.pauses,
             wpm: data.wpm,
             fillers: data.fillers,
             mistake: data.mistake,
             improvement: data.improvement
          });
        }
      } catch (err) {
        console.log("Could not save session to history yet.", err);
      }

      router.push("/result");
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (TOTAL_TIME - timeLeft) / TOTAL_TIME;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Timer Ring */}
      <div className="relative mb-12 flex items-center justify-center">
        {/* Breathing pulse rings when recording */}
        {isRecording && (
          <>
            <div className="absolute w-52 h-52 rounded-full animate-breathe"
                 style={{ border: '2px solid rgba(244, 63, 94, 0.3)' }}></div>
            <div className="absolute w-60 h-60 rounded-full animate-breathe-delay-1"
                 style={{ border: '1.5px solid rgba(244, 63, 94, 0.2)' }}></div>
            <div className="absolute w-68 h-68 rounded-full animate-breathe-delay-2"
                 style={{ border: '1px solid rgba(244, 63, 94, 0.1)', width: '272px', height: '272px' }}></div>
          </>
        )}

        {/* SVG Ring */}
        <div className="relative z-10 w-48 h-48">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isRecording ? "#f43f5e" : "#8b5cf6"} />
                <stop offset="100%" stopColor={isRecording ? "#f97316" : "#22d3ee"} />
              </linearGradient>
            </defs>
            {/* Background ring */}
            <circle
              cx="80" cy="80" r="70"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
            />
            {/* Progress ring */}
            <circle
              cx="80" cy="80" r="70"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          {/* Timer text centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-light tracking-tight font-mono ${isRecording ? 'text-rose-400' : ''}`}
                  style={{ color: isRecording ? undefined : 'var(--text-primary)' }}>
              {formatTime(timeLeft)}
            </span>
            {isRecording && (
              <span className="text-xs font-semibold uppercase tracking-widest mt-1 text-rose-400/60">
                Recording
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center">
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            {/* Gradient spinner */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full animate-spin-slow"
                   style={{ background: 'conic-gradient(from 0deg, transparent, #8b5cf6, #22d3ee, transparent)', mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)' }}>
              </div>
            </div>
            <p className="font-medium animate-shimmer" style={{ color: 'var(--text-secondary)' }}>
              Analyzing your fluency...
            </p>
          </div>
        ) : (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-white cursor-pointer ${
              isRecording 
                ? 'glow-button glow-button-rose' 
                : 'glow-button'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                <span>Finish & Analyze</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                <span>Start Recording</span>
              </>
            )}
          </button>
        )}
        
        {!isRecording && !isProcessing && (
          <p className="mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Press the button and speak continuously.
          </p>
        )}
      </div>
    </div>
  );
}
