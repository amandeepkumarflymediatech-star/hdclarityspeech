'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function MethodSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Stacking cards effect
    const cards = gsap.utils.toArray('.method-card') as HTMLElement[];

    cards.forEach((card: HTMLElement, index: number) => {
      // Pin each card
      ScrollTrigger.create({
        trigger: card,
        start: 'top 10%',
        endTrigger: '.cards-container',
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
      });

      // Animate card scale/opacity as the NEXT card scrolls over it
      if (index < cards.length - 1) {
        gsap.to(card, {
          scale: 0.9,
          opacity: 0.6,
          y: -40,
          scrollTrigger: {
            trigger: cards[index + 1],
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          }
        });
      }

      // Internal element reveal for each card
      gsap.from(card.querySelectorAll('.card-reveal'), {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
        }
      });
    });

  }, { scope: container });

  return (
    <section ref={container} className="px-4 sm:px-6 py-16 sm:py-24 lg:py-32 bg-secondary transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-24 text-center">
          <div className="overflow-hidden mb-4">
             <h4 className="text-accent font-bold tracking-widest uppercase text-sm font-sans block transform translate-y-0">The HD Method</h4>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary font-playfair tracking-tight">3 Steps to Absolute Clarity</h2>
        </div>

        <div className="cards-container relative flex flex-col gap-20 sm:gap-28 pb-16 sm:pb-24">
          {/* Card 1 */}
          <div className="method-card bg-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl flex flex-col-reverse md:flex-row items-center justify-between gap-8 w-full z-10 border border-primary/10 origin-top">
            <div className="flex-1">
              <span className="card-reveal text-primary/20 font-black text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 block font-playfair">01</span>
              <h3 className="card-reveal text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary font-playfair tracking-tight">Assess & Align</h3>
              <p className="card-reveal text-primary/70 mb-6 sm:mb-8 text-base sm:text-lg font-sans leading-relaxed">Sign up in minutes. We'll dive deep into your current speaking habits, identify the friction points, and establish exactly what absolute clarity looks like for you.</p>
              <div className="card-reveal">
                 <Link href="/signup" className="inline-flex px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-bold uppercase tracking-wider text-xs sm:text-sm rounded-full hover:bg-accent transition-colors shadow-md">Begin Assessment</Link>
              </div>
            </div>
            <div className="card-reveal flex-1 w-full relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
              <Image src="/3 Steps/1.png" alt="Assess" fill className="object-cover" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="method-card bg-primary p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl flex flex-col-reverse md:flex-row items-center justify-between gap-8 w-full z-20 border border-white/10 origin-top">
            <div className="flex-1 text-white">
              <span className="card-reveal text-white/20 font-black text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 block font-playfair">02</span>
              <h3 className="card-reveal text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-playfair tracking-tight">The 1:1 Crucible</h3>
              <p className="card-reveal text-white/70 mb-6 sm:mb-8 text-base sm:text-lg font-sans leading-relaxed">Lock in your sessions. No generic courses. You get intense, personalized coaching designed to strip away the noise and forge your delivery.</p>
              <div className="card-reveal">
                 <Link href="/live-class" className="inline-flex px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white font-bold uppercase tracking-wider text-xs sm:text-sm rounded-full hover:bg-white hover:text-primary transition-colors shadow-md">View Mentors</Link>
              </div>
            </div>
            <div className="card-reveal flex-1 w-full relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
              <Image src="/3 Steps/The 11 Crucible.png" alt="1:1 Coaching" fill className="object-cover" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="method-card bg-accent p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl flex flex-col-reverse md:flex-row items-center justify-between gap-8 w-full z-30 border border-white/20 origin-top">
            <div className="flex-1 text-white">
              <span className="card-reveal text-white/30 font-black text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 block font-playfair">03</span>
              <h3 className="card-reveal text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-playfair tracking-tight">Execute in HD</h3>
              <p className="card-reveal text-white/90 mb-6 sm:mb-8 text-base sm:text-lg font-sans leading-relaxed">Walk into your next meeting, presentation, or negotiation with unshakable conviction. The room is yours.</p>
              <div className="card-reveal">
                 <Link href="/live-class" className="inline-flex px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-bold uppercase tracking-wider text-xs sm:text-sm rounded-full hover:bg-primary hover:text-white transition-colors shadow-md">Start Performing</Link>
              </div>
            </div>
            <div className="card-reveal flex-1 w-full relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl bg-white/10">
              <Image src="/3 Steps/Execute in HD.png" alt="Perform" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
