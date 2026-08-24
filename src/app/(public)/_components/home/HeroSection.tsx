'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CheckCircle2, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Background floating orb
    gsap.to('.hero-orb', {
      y: -30,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // 2. Cinematic Entry Sequence
    tl.from('.hero-eyebrow', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
    .from('.hero-line', {
      yPercent: 120,
      stagger: 0.15,
      duration: 1.1,
      ease: 'power4.out',
    }, '-=0.3')
    .from('.hero-description', {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.4')
    .from('.hero-actions', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.3')
    .from('.hero-image-main', {
      y: 80,
      opacity: 0,
      scale: 0.95,
      duration: 1.4,
      ease: 'power4.out',
    }, '-=1');

    // 3. Floating card subtle animation
    gsap.to('.hero-floating-card', {
      y: -12,
      rotation: 2,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // 4. Parallax on scroll
    gsap.to('.parallax-image', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

  }, { scope: container });

  return (
    <section ref={container} className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-secondary min-h-screen flex items-center">
      {/* Background shapes */}
      <div className="hero-orb absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[200px] -z-0"></div>
      <div className="hero-orb absolute bottom-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-0"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="flex flex-col items-start text-left">
          
          <div className="hero-eyebrow inline-flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm border border-primary/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-sm font-bold tracking-widest uppercase text-primary font-sans">
              HD CLARITY METHOD
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-6 sm:mb-8 text-primary font-playfair flex flex-col gap-1 sm:gap-2">
            <div className="overflow-hidden">
               <span className="hero-line block">Speak with</span>
            </div>
            <div className="overflow-hidden">
               <span className="hero-line block text-accent italic font-cormorant">clarity.</span>
            </div>
            <div className="overflow-hidden">
               <span className="hero-line block">Lead with confidence.</span>
            </div>
          </h1>

          <p className="hero-description text-base sm:text-lg lg:text-xl text-primary/80 mb-8 sm:mb-10 leading-relaxed font-sans font-medium max-w-lg">
            Your voice is your sharpest weapon. Transform every presentation, negotiation, and meeting into an undeniable statement of your authority.
          </p>

          <div className="hero-actions flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <Link href="/live-class" className="px-6 sm:px-8 py-3 sm:py-4 bg-accent hover:bg-primary text-white font-bold rounded-none shadow-sm transition-all w-full sm:w-auto text-center text-xs sm:text-sm uppercase tracking-wider">
              Book Your First Session
            </Link>
            <Link href="/about" className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-primary hover:bg-primary text-primary hover:text-white font-bold rounded-none transition-all w-full sm:w-auto text-center text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              Explore Method
            </Link>
          </div>
        </div>

        <div className="hidden lg:block relative w-full lg:max-w-[85%] lg:ml-auto h-[250px] sm:h-[350px] md:h-[400px] lg:h-[550px] mt-8 sm:mt-12 lg:mt-0">
          <div className="hero-image-main absolute inset-0 bg-white border border-primary/10 shadow-2xl p-4 flex flex-col">
            <div className="parallax-image relative flex-1 overflow-hidden bg-secondary mb-4 h-[120%] -top-[10%]">
              <Image 
                src="/hero-img.webp" 
                alt="Client mastering speech" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
            <div className="flex items-center justify-between px-4 pb-2 text-primary">
               <div>
                  <p className="font-playfair font-bold text-lg">Premium Mentorship</p>
                  <p className="font-sans text-primary/60 text-sm">Personalized Feedback</p>
               </div>
               <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent">
                  <Star size={24} />
               </div>
            </div>
          </div>
          
          {/* Floating Badge */}
          <div className="hero-floating-card absolute -left-4 sm:-left-8 top-1/4 bg-white p-4 border border-primary/10 shadow-xl z-20">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent text-white flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="font-bold font-sans text-sm text-primary">HD Clarity</p>
                  <p className="text-xs text-primary/50 uppercase tracking-wider">Proven Results</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
