"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecordingInterface() {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
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
      setTimeLeft(60);
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

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Visualizer / Timer */}
      <div className="relative mb-12 flex items-center justify-center">
        {isRecording && (
          <div className="absolute inset-0 w-48 h-48 bg-red-100 rounded-full animate-ping opacity-75"></div>
        )}
        <div className={`relative z-10 flex items-center justify-center w-48 h-48 rounded-full border-4 transition-colors duration-300 ${isRecording ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-100 bg-gray-50 text-gray-800'}`}>
          <span className="text-4xl font-mono tracking-tighter">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center">
        {isProcessing ? (
          <div className="flex flex-col items-center text-indigo-600 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="font-medium animate-pulse">Analyzing your fluency...</p>
          </div>
        ) : (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:-translate-y-1 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
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
          <p className="mt-6 text-sm text-gray-500">
            Press the button and speak continuously.
          </p>
        )}
      </div>
    </div>
  );
}
