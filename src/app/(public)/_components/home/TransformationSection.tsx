'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CheckCircle2, XCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function TransformationSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // We create a pinned section timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
        }
      });

      // 1. Initial entry of the problem
      tl.from('.problem-title', { opacity: 0, y: 60, duration: 1 })
        .from('.problem-item', { opacity: 0, x: -50, stagger: 0.2, duration: 1 })
        .from('.image-reveal', { clipPath: 'inset(0 100% 0 0)', duration: 1.5, ease: 'power4.inOut' }, '<')
        
      // 2. The transformation (Problem scrolls away left, Solution comes from right)
        .to('.problem-content', { opacity: 0, x: -100, duration: 1, delay: 0.5 })
        .from('.solution-content', { opacity: 0, x: 100, duration: 1 }, '<')
        
      // 3. Image transformation (change overlay color and scale)
        .to('.image-overlay', { backgroundColor: 'rgba(232, 117, 50, 0.4)', duration: 1 }, '<')
        .to('.hero-image-transform', { scale: 1.05, filter: 'grayscale(0%)', duration: 1 }, '<');
    });

  }, { scope: container });

  return (
    <section ref={container} className="relative w-full min-h-[100dvh] lg:h-screen bg-white overflow-hidden flex items-center py-24 lg:py-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex flex-col-reverse lg:flex-row-reverse items-center gap-10 lg:gap-20">
        
        {/* Left Side: Text Transformation */}
        <div className="flex-1 w-full flex flex-col gap-10 lg:block lg:relative lg:h-[400px]">
           
           {/* The Problem (Initial state) */}
           <div className="problem-content lg:absolute lg:inset-0 flex flex-col justify-center text-primary">
              <h4 className="problem-title text-primary/50 font-bold tracking-widest uppercase mb-2 sm:mb-4 text-xs sm:text-sm font-sans flex items-center gap-2">
                <span className="w-6 h-[2px] bg-primary/30"></span> The Reality
              </h4>
              <h2 className="problem-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-playfair tracking-tight mb-4 sm:mb-8">
                Your ideas deserve<br/>to be <span className="text-primary/50 italic font-cormorant">heard.</span>
              </h2>
              <div className="p-4 sm:p-8 bg-secondary/50 border border-primary/10 backdrop-blur-md">
                <p className="problem-item text-primary font-bold font-sans text-sm sm:text-lg mb-3 sm:mb-6">But here is why you're stuck:</p>
                <ul className="space-y-2 sm:space-y-5 text-primary/70 font-sans">
                  <li className="problem-item flex items-center gap-3 sm:gap-4"><XCircle className="text-primary/40 w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> <span className="text-xs sm:text-lg">Overthinking before speaking</span></li>
                  <li className="problem-item flex items-center gap-3 sm:gap-4"><XCircle className="text-primary/40 w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> <span className="text-xs sm:text-lg">Losing the room's attention</span></li>
                  <li className="problem-item flex items-center gap-3 sm:gap-4"><XCircle className="text-primary/40 w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> <span className="text-xs sm:text-lg">Sounding unsure of your expertise</span></li>
                </ul>
              </div>
           </div>

           {/* The Solution (Appears on scroll on desktop) */}
           <div className="solution-content lg:absolute lg:inset-0 flex flex-col justify-center text-primary lg:opacity-0 lg:pointer-events-none">
              <h4 className="text-accent font-bold tracking-widest uppercase mb-2 sm:mb-4 text-xs sm:text-sm font-sans flex items-center gap-2">
                <span className="w-6 h-[2px] bg-accent"></span> The Transformation
              </h4>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-playfair tracking-tight mb-4 sm:mb-8">
                Command The<br/><span className="text-accent italic font-cormorant">Room.</span>
              </h2>
              <div className="p-4 sm:p-8 bg-accent/5 border border-accent/20 backdrop-blur-md">
                <p className="text-primary font-bold font-sans text-sm sm:text-lg mb-3 sm:mb-6">Build a voice people remember:</p>
                <ul className="space-y-2 sm:space-y-5 text-primary/90 font-sans">
                  <li className="flex items-center gap-3 sm:gap-4"><CheckCircle2 className="text-accent w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> <span className="text-xs sm:text-lg">Think clearly under pressure</span></li>
                  <li className="flex items-center gap-3 sm:gap-4"><CheckCircle2 className="text-accent w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> <span className="text-xs sm:text-lg">Speak with unshakable confidence</span></li>
                  <li className="flex items-center gap-3 sm:gap-4"><CheckCircle2 className="text-accent w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> <span className="text-xs sm:text-lg">Lead every meeting and negotiation</span></li>
                </ul>
              </div>
           </div>

        </div>

        {/* Right Side: Image Reveal */}
        <div className="flex-1 w-full max-w-[200px] sm:max-w-xs mx-auto lg:max-w-[400px] lg:ml-auto">
           <div className="image-reveal relative aspect-[4/5] w-full rounded-none overflow-hidden border border-primary/10 shadow-2xl bg-secondary" style={{ clipPath: 'inset(0 0% 0 0)' }}>
              <Image 
                src="/Hridayy.png" 
                alt="Transformation" 
                fill 
                className="hero-image-transform object-cover" 
              />
           </div>
        </div>

      </div>
    </section>
  );
}
