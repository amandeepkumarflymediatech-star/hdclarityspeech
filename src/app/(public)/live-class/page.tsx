'use client';

import React, { useEffect, useRef } from 'react';
import { InlineWidget } from 'react-calendly';
import { Calendar, Video, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';

export default function LiveClassPage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo('.anim-left', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
    )
    .fromTo('.anim-right',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
      '-=0.8'
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full font-sans min-h-screen bg-[#F7F5F0] text-primary relative flex items-center pt-20 sm:pt-24 pb-12">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 rounded-bl-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: The Pitch */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          
          <div className="anim-left flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-accent font-bold tracking-widest uppercase text-xs">Live Tutoring</span>
          </div>
          
          <h1 className="anim-left text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter mb-6 sm:mb-8 text-primary font-playfair leading-[1.1] sm:leading-[1.05]">
            Master Your <br className="hidden sm:block"/><span className="text-accent italic font-cormorant relative inline-block">Speech<div className="absolute bottom-1 left-0 w-full h-2 sm:h-3 bg-accent/20 -z-10 transform -rotate-2"></div></span> Today.
          </h1>
          
          <p className="anim-left text-lg text-primary/80 leading-relaxed mb-10 font-medium">
            Book a personalized 1-on-1 session with elite communication coaches. Build unshakeable confidence in a supportive, live environment.
          </p>
          
          <div className="anim-left flex flex-col gap-4 sm:gap-5 text-sm sm:text-base text-primary/90 font-bold mb-10 sm:mb-12 p-4 sm:p-6 bg-white/40 sm:bg-transparent rounded-3xl sm:rounded-none border border-primary/5 sm:border-transparent">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary"><Clock className="w-5 h-5"/></div> 
              <span>45-Minute Intensive Sessions</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary"><CheckCircle2 className="w-5 h-5"/></div> 
              <span>Direct, Actionable Feedback</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary"><Video className="w-5 h-5"/></div> 
              <span>Seamless Video Integration</span>
            </div>
          </div>
          
          <div className="anim-left flex items-center gap-6 w-full">
             <Link href="/mentors" className="group flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm hover:text-accent transition-colors">
               Meet the Tutors 
               <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all">
                 <ChevronRight className="w-4 h-4" />
               </div>
             </Link>
          </div>
        </div>

        {/* Right Side: The Action (Calendly Widget) */}
        <div className="anim-right lg:col-span-7 w-full relative">
           
           <div className="relative bg-white p-2 sm:p-4 md:p-6 rounded-[30px] sm:rounded-[40px] shadow-2xl border border-primary/5 mt-8 lg:mt-0">
             <div className="bg-[#F7F5F0]/50 rounded-[20px] sm:rounded-[28px] overflow-hidden min-h-[700px] flex flex-col relative z-10 border border-primary/5">
               {calendlyUrl ? (
                 <InlineWidget url={calendlyUrl} styles={{ height: '700px', width: '100%' }} />
               ) : (
                 <div className="text-center py-16 sm:py-24 px-4 sm:px-8 text-primary">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/10 shadow-lg shadow-primary/5">
                     <Calendar className="w-10 h-10 text-accent" />
                   </div>
                   <h3 className="text-3xl font-black mb-4 font-playfair tracking-tight">Scheduling is currently offline</h3>
                   <p className="text-primary/60 max-w-md mx-auto text-lg font-sans leading-relaxed mb-8">
                     Our tutors are currently fully booked. Please check back later or view our tutor roster to join a waitlist.
                   </p>
                   <Link href="/mentors" className="inline-block px-8 py-4 bg-primary hover:bg-accent text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all shadow-md">
                     Browse Tutors
                   </Link>
                 </div>
               )}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}