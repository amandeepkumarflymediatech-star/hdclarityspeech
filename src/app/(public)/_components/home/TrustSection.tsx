'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function TrustSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate stats items stagger
    gsap.from('.stat-item', {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        once: true,
      },
    });

    // Animate numbers
    const counters = document.querySelectorAll('.counter-val');
    counters.forEach((counter: any) => {
      const target = parseFloat(counter.getAttribute('data-target') || '0');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          once: true,
        },
        onUpdate: () => {
          counter.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
        },
      });
    });

  }, { scope: container });

  return (
    <section ref={container} className="py-8 sm:py-12 bg-white border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-primary/10">
          
          <div className="stat-item flex flex-col items-center text-center py-6 sm:py-0">
             <div className="text-2xl sm:text-3xl md:text-4xl font-black font-playfair text-primary mb-1 sm:mb-2">
                <span className="counter-val" data-target="500" data-suffix="+">0</span>
             </div>
             <p className="text-primary/60 font-sans font-bold uppercase tracking-widest text-xs sm:text-sm">Active Learners</p>
          </div>

          <div className="stat-item flex flex-col items-center text-center py-6 sm:py-0">
             <div className="text-2xl sm:text-3xl md:text-4xl font-black font-playfair text-primary mb-1 sm:mb-2">
                <span className="counter-val" data-target="1" data-suffix=":1" data-prefix="">0</span>
             </div>
             <p className="text-primary/60 font-sans font-bold uppercase tracking-widest text-xs sm:text-sm">Elite Coaching</p>
          </div>

          <div className="stat-item flex flex-col items-center text-center py-6 sm:py-0">
             <div className="text-2xl sm:text-3xl md:text-4xl font-black font-playfair text-primary mb-1 sm:mb-2">
                <span className="counter-val" data-target="100" data-suffix="%">0</span>
             </div>
             <p className="text-primary/60 font-sans font-bold uppercase tracking-widest text-xs sm:text-sm">Global Reach</p>
          </div>

        </div>
      </div>
    </section>
  );
}
