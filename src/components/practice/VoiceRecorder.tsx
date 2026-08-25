"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, RotateCcw, Volume2 } from "lucide-react";

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioURL(null);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required to use the voice recorder.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setAudioURL(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-3xl flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-4">
        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]"></span>
            <span className="text-red-500 font-bold font-mono tracking-wider">{formatTime(recordingTime)}</span>
          </div>
        )}
        {!isRecording && audioURL && (
          <div className="flex items-center gap-2 text-primary/60 font-bold font-mono tracking-wider">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-6">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="w-16 h-16 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-red-200"
          >
            <Mic size={24} />
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="w-16 h-16 bg-red-500 text-white hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-red-500/30 animate-in zoom-in"
          >
            <Square size={24} className="fill-current" />
          </button>
        )}
      </div>

      {audioURL && (
        <div className="w-full flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <audio controls src={audioURL} className="w-full max-w-md h-10 custom-audio" />
          <button 
            onClick={resetRecording}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary/50 hover:text-primary transition-colors hover:bg-secondary/10 rounded-full"
          >
            <RotateCcw size={14} /> Retry Recording
          </button>
        </div>
      )}
      
      {!isRecording && !audioURL && (
        <p className="text-sm text-primary/40 font-sans text-center max-w-xs">
          Click the microphone to start recording your voice. Play it back to evaluate your pronunciation!
        </p>
      )}
    </div>
  );
}
