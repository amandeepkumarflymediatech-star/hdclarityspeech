'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, CheckCircle2, Film } from 'lucide-react';

import { getVideoEmbedInfo } from '@/lib/video-utils';

interface TutorVideoShowcaseProps {
  tutorName: string;
  tutorId: string;
  tutorImage?: string | null;
  videoUrl?: string | null;
  bio?: string | null;
}

// Client Video Registry:
// When the client shares the video file or link, add/update the URL here or pass it dynamically!
// Supports:
// 1. Local MP4: '/videos/tanmay-intro.mp4' or '/videos/tutor-intro.mp4'
// 2. YouTube URL: 'https://www.youtube.com/watch?v=...' or 'https://youtu.be/...'
// 3. Vimeo URL: 'https://vimeo.com/...'
// 4. Cloudinary / Direct CDN MP4 URL
export const CLIENT_TUTOR_VIDEOS: Record<string, string> = {
  // Tanmay Kaushal / Lead Tutor
  '43689d6d-2961-4e52-afbf-0caa59d9d786': '',
  // Sarah Tutor
  'a954aa7d-4f23-425a-843d-e3a30a7227eb': '',
  // John Tutor
  'bebbd2bd-b677-4eed-b8bb-7f32e1e6e9ae': '',
};

export default function TutorVideoShowcase({
  tutorName,
  tutorId,
  tutorImage,
  videoUrl: propVideoUrl,
}: TutorVideoShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showIntegrationNotice, setShowIntegrationNotice] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeVideoUrl = propVideoUrl || CLIENT_TUTOR_VIDEOS[tutorId] || '';
  const videoInfo = getVideoEmbedInfo(activeVideoUrl);

  const handlePlayToggle = () => {
    if (!activeVideoUrl) {
      // If no video URL provided yet, show client integration modal/notice
      setShowIntegrationNotice(true);
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  const handleVolumeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="mt-16 pt-16 border-t border-primary/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-3">
            <Film className="w-3.5 h-3.5 text-accent" />
            <span className="text-accent text-[11px] font-bold uppercase tracking-wider">
              Tutor Showcase
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-playfair text-primary tracking-tight">
            Meet <span className="text-accent italic font-cormorant">{tutorName}</span> in Action
          </h2>
          <p className="text-primary/70 font-sans text-sm md:text-base mt-2 max-w-xl">
            Watch this short introduction to see how {tutorName} guides students through articulation drills, voice placement, and high-impact speaking.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-primary/10 shadow-sm text-xs font-bold text-primary">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span>1:1 Coaching Video Introduction</span>
        </div>
      </div>

      {/* Cinema Video Container */}
      <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-primary/15 group">
        
        {/* If Embed (YouTube / Vimeo / Loom) */}
        {videoInfo.isValid && videoInfo.isIframe ? (
          <iframe
            src={videoInfo.embedUrl}
            title={`${tutorName} Intro Video`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoInfo.isValid ? (
          // Direct HTML5 Video
          <>
            <video
              ref={videoRef}
              src={videoInfo.embedUrl}
              poster={tutorImage || '/hero-img.webp'}
              className="w-full h-full object-cover"
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Custom Video Controls Overlay */}
            <div 
              className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
              }`}
              onClick={handlePlayToggle}
            >
              <button
                className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
            </div>

            {/* Bottom Bar Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs">
              <span className="font-bold tracking-wider">{tutorName} • HD Clarity Coaching Session</span>
              <div className="flex items-center gap-3">
                <button onClick={handleVolumeToggle} className="p-2 hover:text-accent transition-colors">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={handleFullscreen} className="p-2 hover:text-accent transition-colors">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Interactive Placeholder / Cinema Poster Ready for Video
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900 overflow-hidden">
            {/* Background Poster Image */}
            {tutorImage ? (
              <Image
                src={tutorImage}
                alt={tutorName}
                fill
                className="object-cover opacity-25 filter blur-[2px] scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-slate-900 to-black" />
            )}

            <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
              {/* Play Button Trigger */}
              <button
                onClick={handlePlayToggle}
                className="relative mb-6 group/btn"
                aria-label="Play introduction video"
              >
                <span className="absolute -inset-4 rounded-full bg-accent/30 animate-ping opacity-75" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white group-hover/btn:text-accent">
                  <Play size={36} className="ml-1.5 fill-current" />
                </div>
              </button>

              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-bold mb-3 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Video Introduction Showcase
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-white font-playfair mb-2">
                Watch {tutorName}&apos;s Introduction
              </h3>
              <p className="text-white/70 text-xs sm:text-sm font-sans max-w-md mb-4 leading-relaxed">
                Click to preview the HD Clarity Speech mentoring methodology and live session demo.
              </p>

              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                Duration: 2:45 min • High Definition
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Client Video Integration Info Modal / Popover */}
      {showIntegrationNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-secondary/30 relative text-left">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5">
              <Film size={26} />
            </div>

            <h4 className="text-2xl font-bold font-playfair text-primary mb-2">
              Tutor Video Section Ready
            </h4>
            
            <p className="text-primary/70 font-sans text-sm leading-relaxed mb-6">
              This video showcase section is fully prepared and styled. Once the client shares the final video file or YouTube / Vimeo link for <strong>{tutorName}</strong>, it will stream seamlessly here.
            </p>

            <div className="bg-[#F7F5F0] p-4 rounded-xl border border-primary/10 text-xs font-sans text-primary/80 mb-6 space-y-1">
              <p className="font-bold text-primary flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-accent" />
                Supported Formats:
              </p>
              <p>• Direct MP4 / WebM video files</p>
              <p>• YouTube or Vimeo video links</p>
              <p>• Cloudinary or AWS S3 video URLs</p>
            </div>

            <button
              onClick={() => setShowIntegrationNotice(false)}
              className="w-full py-3 bg-primary text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-accent transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Feature Highlights beneath video */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent shrink-0 font-bold text-sm">
            01
          </div>
          <div>
            <h4 className="font-bold text-primary text-sm font-sans mb-1">Articulation & Diction</h4>
            <p className="text-xs text-primary/70 leading-relaxed">
              Drills tailored to eliminate filler words, mumbling, and unclear pronunciation.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent shrink-0 font-bold text-sm">
            02
          </div>
          <div>
            <h4 className="font-bold text-primary text-sm font-sans mb-1">Pacing & Vocal Depth</h4>
            <p className="text-xs text-primary/70 leading-relaxed">
              Command boardroom authority with resonant tone, strategic pauses, and breath control.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent shrink-0 font-bold text-sm">
            03
          </div>
          <div>
            <h4 className="font-bold text-primary text-sm font-sans mb-1">Live Targeted Feedback</h4>
            <p className="text-xs text-primary/70 leading-relaxed">
              Real-time actionable adjustments during every 1:1 session for rapid, visible results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
