'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, UserCheck, Video, Image as ImageIcon, Sparkles, ExternalLink } from 'lucide-react';
import { getVideoEmbedInfo } from '@/lib/video-utils';
import { CLIENT_TUTOR_VIDEOS } from './TutorVideoShowcase';

interface MentorHeroMediaProps {
  tutorName: string;
  tutorId: string;
  tutorImage?: string | null;
  videoUrl?: string | null;
}

export default function MentorHeroMedia({
  tutorName,
  tutorId,
  tutorImage,
  videoUrl,
}: MentorHeroMediaProps) {
  const activeVideoUrl = videoUrl || CLIENT_TUTOR_VIDEOS[tutorId] || '';
  const hasVideo = Boolean(activeVideoUrl);
  const videoInfo = getVideoEmbedInfo(activeVideoUrl);

  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');

  const handleOpenVideo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (hasVideo) {
      setActiveTab('video');
    } else {
      // If no video, scroll down to the intro section where notice is shown
      const el = document.getElementById('intro-video');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-96 sm:h-[460px] md:h-full min-h-[400px] md:min-h-[500px] bg-slate-950 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Floating Controls & Badges */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Verified Badge */}
        <div className="bg-primary/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg text-[11px] font-bold uppercase tracking-wider border border-white/10 pointer-events-auto">
          <UserCheck size={14} className="text-accent" />
          <span>Verified Coach</span>
        </div>

        {/* Media Switcher Tabs (if tutor has video) */}
        {hasVideo && (
          <div className="bg-black/70 backdrop-blur-md p-1 rounded-full border border-white/15 flex items-center gap-1 shadow-lg pointer-events-auto">
            <button
              type="button"
              onClick={() => setActiveTab('photo')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeTab === 'photo'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ImageIcon size={13} />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeTab === 'video'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-accent hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <Video size={13} />
              <span>Video</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Display: Photo vs Video */}
      {activeTab === 'photo' ? (
        <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] bg-secondary flex items-center justify-center">
          {tutorImage ? (
            <Image
              src={tutorImage}
              alt={tutorName}
              fill
              priority
              className="object-cover mix-blend-multiply opacity-95 transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-playfair text-8xl font-black">
              {tutorName?.charAt(0) || 'T'}
            </div>
          )}

          {/* Subtle gradient vignette at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Quick "Watch Video" Floating Button on Image */}
          <div className="absolute bottom-5 inset-x-5 z-20 flex flex-col items-center">
            {hasVideo ? (
              <button
                type="button"
                onClick={handleOpenVideo}
                className="w-full py-3.5 px-5 bg-black/75 hover:bg-accent text-white backdrop-blur-md rounded-2xl border border-white/20 hover:border-accent shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group/btn hover:scale-[1.02]"
              >
                <div className="w-8 h-8 rounded-full bg-accent group-hover/btn:bg-white text-white group-hover/btn:text-accent flex items-center justify-center transition-colors shadow-md">
                  <Play size={14} className="ml-0.5 fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-wider leading-none">Watch Intro Video</p>
                  <p className="text-[10px] text-white/70 group-hover/btn:text-white/90 leading-tight mt-0.5">Hear speaking cadence & accent clarity</p>
                </div>
              </button>
            ) : (
              <a
                href="#intro-video"
                className="w-full py-3 px-4 bg-white/90 hover:bg-white text-primary backdrop-blur-md rounded-2xl border border-primary/10 shadow-lg text-center transition-all"
              >
                <p className="text-xs font-bold flex items-center justify-center gap-1.5">
                  <Sparkles size={14} className="text-accent" />
                  <span>Meet {tutorName} In Action</span>
                </p>
              </a>
            )}
          </div>
        </div>
      ) : (
        /* Video Mode directly in Hero */
        <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] bg-black flex flex-col justify-center items-center">
          {videoInfo.isValid && videoInfo.isIframe ? (
            <iframe
              src={videoInfo.embedUrl}
              title={`${tutorName} Video Intro`}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : videoInfo.isValid ? (
            <video
              src={videoInfo.embedUrl}
              controls
              autoPlay
              playsInline
              poster={tutorImage || undefined}
              className="w-full h-full object-contain absolute inset-0"
            />
          ) : (
            <div className="p-8 text-center text-white max-w-xs">
              <Video className="w-12 h-12 text-accent mx-auto mb-3" />
              <h4 className="font-playfair text-lg font-bold">Video Showcase</h4>
              <p className="text-xs text-white/70 mt-1 mb-4">
                The introduction video for {tutorName} is currently being prepared.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold"
              >
                Back to Photo
              </button>
            </div>
          )}

          {/* Bottom Bar overlay inside Hero video */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <span className="bg-black/80 backdrop-blur-md text-white/90 text-[10px] px-2.5 py-1 rounded-lg border border-white/10 font-sans pointer-events-auto">
              Live Intro • {tutorName}
            </span>

            <a
              href="#intro-video"
              className="bg-accent/90 hover:bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 transition-colors pointer-events-auto"
            >
              <span>Cinema View</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
