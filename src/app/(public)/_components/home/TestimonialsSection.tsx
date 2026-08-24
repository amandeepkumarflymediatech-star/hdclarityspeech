'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    { name: 'Mazin', role: 'Sales Director', time: '2 months ago', text: 'I avoided presentations and feared losing the room. Now I lead global meetings with absolute confidence.', stars: 5 },
    { name: 'Tarun', role: 'Product Manager', time: '3 months ago', text: 'My ideas were great, but my delivery made them sound weak. The 1:1 sessions completely changed my professional presence.', stars: 5 },
    { name: 'Sarah', role: 'Founder', time: '4 months ago', text: 'Pitching to investors always made me second-guess myself. I command the room now. My last pitch secured full funding.', stars: 5 },
    { name: 'Aisha', role: 'Executive', time: '1 month ago', text: 'I struggled to maintain authority in high-stakes negotiations. The HD Method gave me the framework to speak with conviction.', stars: 5 },
    { name: 'David', role: 'Software Engineer', time: '5 months ago', text: 'I got passed over for promotions because I was too quiet. My communication skills are now my biggest career asset.', stars: 5 },
    { name: 'Elena', role: 'Marketing Head', time: '2 weeks ago', text: 'English isn\'t my first language. I felt insecure speaking up. I present to international clients without a second thought.', stars: 5 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsToShow(1);
      else if (window.innerWidth < 1280) setItemsToShow(2);
      else setItemsToShow(3);
    };
    // Set initial value
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="bg-white py-24 sm:py-32 font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-playfair font-black text-primary text-center mb-12">
          Our Happy Clients
        </h2>

        <div className="bg-[#F8F9FA] rounded-[40px] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 relative">
          
          {/* Left Summary Section */}
          <div className="flex-shrink-0 lg:w-64 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-secondary/50 pb-10 lg:pb-0 lg:pr-10 text-center">
            <h3 className="text-primary font-black uppercase tracking-widest text-lg mb-4">Excellent</h3>
            <div className="flex text-[#FFB800] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} fill="currentColor" />
              ))}
            </div>
            <p className="text-primary font-bold text-lg mb-1">5.0<span className="text-primary/40 text-sm font-normal">/5</span></p>
            <p className="text-primary/60 text-xs font-medium mb-8">Based on 150+ reviews</p>
            
            <div className="flex items-center gap-2 font-bold text-xl text-primary/80">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4285F4] text-xl font-black shadow-sm">
                G
              </span>
              Google
            </div>
          </div>

          {/* Right Carousel Section */}
          <div 
            className="flex-1 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Arrow Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg border border-secondary z-20 hover:scale-110 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg border border-secondary z-20 hover:scale-110 transition-transform"
            >
              <ChevronRight size={20} />
            </button>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getVisibleTestimonials().map((t, i) => (
                <TestimonialCard key={`${t.name}-${currentIndex}-${i}`} t={t} />
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-accent' : 'w-2 bg-secondary hover:bg-primary/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = t.text.length > 80;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-secondary/30 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
            {t.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-primary text-sm">{t.name}</h4>
            <p className="text-[10px] text-primary/50">{t.time}</p>
          </div>
        </div>
        <span className="text-[#EA4335] font-black text-xl">G</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-[#FFB800]">
          {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
        </div>
        <span className="flex items-center gap-1 text-[10px] text-[#006BFF] font-bold uppercase tracking-wider">
          <BadgeCheck size={12} /> Verified
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        <p className={`text-primary/70 text-sm leading-relaxed mb-4 ${!isExpanded && isLongText ? 'line-clamp-3' : ''}`}>
          "{t.text}"
        </p>

        {isLongText && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-left text-xs font-bold text-primary/40 flex items-center gap-1 hover:text-primary transition-colors mt-auto"
          >
            <ChevronRight size={12} className={`transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`} /> 
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
}
