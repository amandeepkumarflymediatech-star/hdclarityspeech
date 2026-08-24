'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Star, ChevronRight, Users, LayoutDashboard, Clock } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const programs = [
  {
    id: 'coaching',
    title: '1:1 Elite Coaching',
    description: 'Get personalized guidance through live one-on-one sessions customized entirely to your learning goals and speed. No generic advice, just targeted feedback.',
    icon: Star,
    bgImage: '/programs/coaching.jpg',
    color: 'bg-primary',
    textColor: 'text-white'
  },
  {
    id: 'workshops',
    title: 'Live Workshops',
    description: 'Join interactive group sessions and learn alongside a community of driven peers.',
    icon: Users,
    bgImage: '/programs/workshops.jpg',
    color: 'bg-white',
    textColor: 'text-primary'
  },
  {
    id: 'dashboard',
    title: 'Student Dashboard',
    description: 'Track progress, access purchased content, and manage your upcoming schedule all from a central, beautifully designed hub tailored to your journey.',
    icon: LayoutDashboard,
    bgImage: '/programs/dashboard.jpg',
    color: 'bg-secondary',
    textColor: 'text-primary'
  },
  {
    id: 'scheduling',
    title: 'Flexible Scheduling',
    description: 'Book sessions at your convenience across different timezones.',
    icon: Clock,
    bgImage: '/programs/scheduling.jpg',
    color: 'bg-accent',
    textColor: 'text-white'
  }
];

export default function ProgramsSection() {
  const container = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState('coaching');

  useGSAP(() => {
    gsap.from('.program-accordion', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 75%',
      },
    });
  }, { scope: container });

  return (
    <section ref={container} className="px-4 sm:px-6 py-16 sm:py-24 lg:py-32 bg-secondary/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 sm:mb-4 text-xs sm:text-sm font-sans">Programs</h4>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary font-playfair tracking-tight">Everything you need to <br className="hidden sm:block" />master your voice.</h2>
        </div>

        {/* Accordion Layout */}
        <div className="program-accordion flex flex-col md:flex-row h-auto md:h-[550px] gap-4 md:gap-4">
          {programs.map((program) => {
            const isActive = activeItem === program.id;
            return (
              <div 
                key={program.id}
                onMouseEnter={() => setActiveItem(program.id)}
                onClick={() => setActiveItem(program.id)}
                className={`relative flex flex-col justify-end overflow-hidden rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer border border-primary/10 shadow-lg ${isActive ? 'md:flex-[3] h-[350px] md:h-full' : 'md:flex-1 h-[120px] md:h-full'} ${program.color}`}
              >
                {/* Background Image */}
                <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isActive ? 'opacity-50 mix-blend-multiply grayscale' : 'opacity-0'}`}>
                   {program.bgImage && (
                     <Image src={program.bgImage} alt={program.title} fill className="object-cover" />
                   )}
                </div>

                {/* Content Overlay */}
                <div className={`relative z-10 p-6 sm:p-8 flex flex-col justify-end h-full w-full ${program.textColor} ${!isActive && 'md:items-center'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100'} ${program.color === 'bg-primary' || program.color === 'bg-accent' ? 'bg-white/20' : 'bg-primary/10'}`}>
                         <program.icon size={24} />
                      </div>
                      <h3 className={`font-black font-playfair tracking-tight transition-all duration-700 overflow-hidden min-w-0 ${isActive ? 'text-2xl sm:text-3xl md:text-4xl max-w-full opacity-100 whitespace-nowrap' : 'text-xl sm:text-2xl max-w-full opacity-100 leading-tight'}`}>
                        {program.title}
                      </h3>
                   </div>
                   
                   <div className={`transition-all duration-700 overflow-hidden ${isActive ? 'max-h-[300px] opacity-100 mt-4 md:mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                      <p className={`font-sans text-sm sm:text-base md:text-lg max-w-lg mb-6 sm:mb-8 leading-relaxed ${program.color === 'bg-primary' || program.color === 'bg-accent' ? 'text-white/80' : 'text-primary/70'}`}>
                        {program.description}
                      </p>
                      <Link href="/live-class" className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full px-6 py-3 transition-colors shadow-sm ${program.color === 'bg-primary' || program.color === 'bg-accent' ? 'bg-white text-primary hover:bg-accent hover:text-white' : 'bg-primary text-white hover:bg-accent'}`}>
                        Explore Detail <ChevronRight size={16} />
                      </Link>
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
