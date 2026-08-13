'use client';

import React, { useEffect, useRef } from 'react';
import { InlineWidget } from 'react-calendly';
import { Calendar, Video, Clock, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import logoImg from "@/../public/logo.png";
import gsap from 'gsap';

export default function LiveClassPage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    // Simple entry animation
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="w-full font-sans min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="px-6 pt-32 pb-16 text-center relative z-10" ref={headerRef}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 flex justify-center">
            <Image src={logoImg} alt="HD Clarity Logo" className="w-auto h-24 rounded-2xl shadow-2xl border border-white/10" priority />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm mb-8 backdrop-blur-md">
            <Video className="w-4 h-4" />
            <span>Live 1-on-1 Sessions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-100 dark:to-indigo-200">
            Master Your Speech with Expert Guidance
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-12">
            Book a personalized live session with our top speech coaches. Overcome stuttering, improve clarity, and build confidence.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-400"/> 45-Minute Sessions</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400"/> Actionable Feedback</div>
            <div className="flex items-center gap-2"><Video className="w-5 h-5 text-blue-400"/> Google Meet Integration</div>
          </div>
          
          <div className="mt-16 w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl relative h-64 md:h-[400px]">
            <Image src="/tutor-call.png" alt="Live Session" fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Calendly Widget Section */}
      <section className="px-6 pb-32 relative z-10" ref={cardsRef}>
        <div className="max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-2">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl min-h-[700px] transition-colors duration-300 flex flex-col justify-center">
            {calendlyUrl ? (
              <InlineWidget url={calendlyUrl} styles={{ height: '700px', width: '100%' }} />
            ) : (
              <div className="text-center py-24 px-6 text-slate-800 dark:text-slate-200">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100 dark:border-blue-800">
                  <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Scheduling Temporarily Unavailable</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg">
                  We are currently updating our tutor schedules. Please check back soon to book your next session.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}