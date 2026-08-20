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
    <div className="w-full font-sans min-h-screen bg-white text-primary relative overflow-hidden transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="px-6 pt-32 pb-16 text-center relative z-10" ref={headerRef}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 flex justify-center">
            <Image src={logoImg} alt="HD Clarity Logo" className="w-auto h-24 rounded-none shadow-sm border border-secondary" priority />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-secondary border border-primary/10 text-primary font-bold text-sm mb-8 uppercase tracking-widest">
            <Video className="w-4 h-4 text-accent" />
            <span>Live 1-on-1 Sessions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-primary font-playfair">
            Master Your Speech with Expert Guidance
          </h1>
          <p className="text-lg md:text-xl text-primary/80 leading-relaxed max-w-2xl mx-auto mb-12">
            Book a personalized live session with our top speech coaches. Overcome stuttering, improve clarity, and build confidence.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-accent"/> 45-Minute Sessions</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent"/> Actionable Feedback</div>
            <div className="flex items-center gap-2"><Video className="w-5 h-5 text-accent"/> Video Integration</div>
          </div>
          
          <div className="mt-16 w-full rounded-none overflow-hidden border border-secondary shadow-lg relative h-64 md:h-[400px] bg-secondary">
            <Image src="/tutor-call.png" alt="Live Session" fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-700 mix-blend-multiply grayscale contrast-125" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80"></div>
          </div>
        </div>
      </section>

      {/* Calendly Widget Section */}
      <section className="px-6 pb-32 relative z-10" ref={cardsRef}>
        <div className="max-w-5xl mx-auto bg-secondary p-2 rounded-none shadow-xl border border-primary/10">
          <div className="bg-white p-4 md:p-8 rounded-none border border-secondary shadow-inner min-h-[700px] transition-colors duration-300 flex flex-col justify-center">
            {calendlyUrl ? (
              <InlineWidget url={calendlyUrl} styles={{ height: '700px', width: '100%' }} />
            ) : (
              <div className="text-center py-24 px-6 text-primary">
                <div className="w-20 h-20 bg-secondary flex items-center justify-center mx-auto mb-6 border border-primary/20">
                  <Calendar className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-playfair tracking-tight">Scheduling Temporarily Unavailable</h3>
                <p className="text-primary/70 max-w-md mx-auto text-lg font-sans">
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