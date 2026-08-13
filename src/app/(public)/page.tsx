'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CheckCircle2, ChevronDown, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Stacking cards animation
    const cards = gsap.utils.toArray('.sticky-card');
    
    cards.forEach((card: any, index: number) => {
      ScrollTrigger.create({
        trigger: card,
        start: `top ${100 + index * 40}px`, // Offset each card
        endTrigger: '.cards-container',
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
      });
    });

    // Accordion animation
    const accordions = gsap.utils.toArray('.accordion-item');
    accordions.forEach((acc: any) => {
      const header = acc.querySelector('.accordion-header');
      const content = acc.querySelector('.accordion-content');
      const icon = acc.querySelector('.accordion-icon');
      
      let isOpen = false;
      const tween = gsap.to(content, {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        paused: true,
      });
      const iconTween = gsap.to(icon, {
        rotation: 180,
        duration: 0.3,
        paused: true,
      });
      
      header.addEventListener('click', () => {
        if (!isOpen) {
          tween.play();
          iconTween.play();
        } else {
          tween.reverse();
          iconTween.reverse();
        }
        isOpen = !isOpen;
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="w-full font-sans text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white -z-10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 -left-40 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-50" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6 text-slate-900 dark:text-white transition-colors duration-300">
          Learn New Skills. <span className="text-blue-600 block sm:inline">On Your Time.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed transition-colors duration-300">
          Book one-on-one online sessions tailored to your needs. Choose a convenient time, connect through Google Meet, and get the support you need from anywhere.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/live-class" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto">
            Start Learning
          </Link>
          <Link href="/about" className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-full shadow-sm hover:shadow-md transition-all w-full sm:w-auto">
            About us
          </Link>
        </div>
      </section>

      {/* 2. Value Proposition */}
      <section className="px-6 py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-700 dark:text-slate-300 transition-colors duration-300">
            With personalized one-on-one sessions, flexible scheduling, and ongoing membership options, our platform has become a trusted place for individuals seeking dedicated support and real results.
          </p>
        </div>
      </section>

      {/* 3. How It Works (Sticky Cards) */}
      <section className="px-6 py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Start Learning</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg transition-colors duration-300">Your journey to mastery in 3 simple steps</p>
          </div>
          
          <div className="cards-container relative flex flex-col gap-10">
            {/* Card 1 */}
            <div className="sticky-card bg-white dark:bg-slate-950 p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10 w-full z-10 transform origin-top transition-colors duration-300">
              <div className="flex-1">
                <span className="text-blue-600 font-bold text-lg mb-2 block">Step 01</span>
                <h3 className="text-3xl font-bold mb-4 dark:text-white">Create Account</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Sign up in minutes and unlock your personalized dashboard where you can manage sessions, view progress, and access resources.</p>
                <Link href="/signup" className="inline-flex px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition">Get Started</Link>
              </div>
              <div className="flex-1 w-full relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                <Image src="/student-learning.png" alt="Create Account" fill className="object-cover" />
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="sticky-card bg-white dark:bg-slate-950 p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10 w-full z-20 transform origin-top transition-colors duration-300">
              <div className="flex-1">
                <span className="text-blue-600 font-bold text-lg mb-2 block">Step 02</span>
                <h3 className="text-3xl font-bold mb-4 dark:text-white">Book 1:1 Session</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Choose a date and time that works for you. Browse our expert tutors and lock in your session instantly.</p>
                <Link href="/live-class" className="inline-flex px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition">View Courses</Link>
              </div>
              <div className="flex-1 w-full relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                <Image src="/tutor-call.png" alt="Book 1:1 Session" fill className="object-cover" />
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="sticky-card bg-white dark:bg-slate-950 p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10 w-full z-30 transform origin-top transition-colors duration-300">
              <div className="flex-1">
                <span className="text-blue-600 font-bold text-lg mb-2 block">Step 03</span>
                <h3 className="text-3xl font-bold mb-4 dark:text-white">Learn & Grow</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Start learning at your own pace with tailored 1-on-1 guidance designed to help you reach your specific goals faster.</p>
                <Link href="/live-class" className="inline-flex px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">Start Learning</Link>
              </div>
              <div className="flex-1 w-full relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                <Image src="/student-success.png" alt="Learn & Grow" fill className="object-cover" />
              </div>
            </div>
            
            {/* Invisible spacer so we can scroll past the pinned cards smoothly */}
            <div className="h-[20vh]"></div>
          </div>
        </div>
      </section>

      {/* 4. What We Offer (Accordions) */}
      <section className="px-6 py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center transition-colors duration-300">What We Offer</h2>
          
          <div className="flex flex-col gap-4">
            {[
              { title: '1:1 Coaching', content: 'Get personalized guidance through live one-on-one sessions customized entirely to your learning goals and speed.' },
              { title: 'Live Workshops', content: 'Join interactive group sessions and live classes where you can learn alongside a community of peers.' },
              { title: 'Student Dashboard', content: 'Track progress, access purchased content, and manage your upcoming schedule all from a central hub.' },
              { title: 'Flexible Scheduling', content: 'Book sessions at your convenience. We match you with experts across different timezones to fit your busy life.' },
              { title: 'Community Support', content: 'Connect with mentors and fellow learners in our exclusive community forums and chat channels.' }
            ].map((item, i) => (
              <div key={i} className="accordion-item border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <button className="accordion-header w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                  <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                  <ChevronDown className="accordion-icon text-slate-400 dark:text-slate-500" />
                </button>
                <div className="accordion-content h-0 overflow-hidden opacity-0">
                  <div className="p-6 pt-0 text-slate-600 dark:text-slate-400">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us (Grid) */}
      <section className="px-6 py-24 bg-slate-900 dark:bg-slate-950 text-white transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h4 className="text-blue-400 font-semibold tracking-wider uppercase mb-2">Why Choose Us</h4>
            <h2 className="text-4xl font-bold">Learn Smarter. Grow Faster.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Personalized Sessions', desc: 'Custom curriculum tailored exactly to your strengths and weaknesses.' },
              { title: 'Flexible Scheduling', desc: 'Find times that work for you, no matter your timezone or routine.' },
              { title: 'One-on-One Attention', desc: 'Undivided focus from expert instructors dedicated to your success.' },
              { title: 'Online Convenience', desc: 'Learn from the comfort of your home using seamless Google Meet integrations.' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800/50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-700 dark:border-slate-800 transition-colors duration-300">
                <CheckCircle2 className="text-blue-400 w-10 h-10 mb-6" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. About Preview */}
      <section className="px-6 py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div>
              <h4 className="text-blue-600 font-semibold tracking-wider uppercase mb-2">About us</h4>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight transition-colors duration-300">Personalized Support That Fits Your Schedule.</h2>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300">
              We believe education shouldn't be one-size-fits-all. Our platform connects you with dedicated professionals who adapt to your learning style, ensuring you acquire the skills you need efficiently.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <CheckCircle2 size={16} />
                </div>
                Expert Guidance
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <CheckCircle2 size={16} />
                </div>
                Flexible Access
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <CheckCircle2 size={16} />
                </div>
                Real Results
              </li>
            </ul>
            <div className="pt-4">
              <Link href="/about" className="px-8 py-4 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition shadow-lg inline-block">
                More About Us
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative rounded-3xl aspect-[4/3] flex items-center justify-center overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 z-10 mix-blend-overlay" />
             <Image src="/team-office.png" alt="Our Team" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 mb-16 text-center">
          <h4 className="text-blue-600 font-semibold tracking-wider uppercase mb-2">Testimonials</h4>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Success Stories</h2>
        </div>
        
        <div className="flex gap-6 px-6 pb-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {[
            { name: 'Mazin', country: 'Saudi Arabia 🇸🇦', text: 'The 1:1 sessions completely changed my approach. I gained confidence in just 3 weeks!' },
            { name: 'Tarun', country: 'India 🇮🇳', text: 'Flexible scheduling allowed me to learn while working full time. Highly recommend to everyone.' },
            { name: 'Sarah', country: 'USA 🇺🇸', text: 'My tutor was exceptionally patient and tailored every lesson to my exact career goals.' },
            { name: 'Aisha', country: 'UAE 🇦🇪', text: 'The dashboard makes tracking my progress so easy. Worth every penny.' },
          ].map((t, i) => (
            <div key={i} className="snap-center shrink-0 w-80 md:w-96 bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <div className="flex text-yellow-400 mb-6">
                {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Contact Form */}
      <section className="px-6 py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto bg-slate-900 dark:bg-slate-900/80 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border dark:border-slate-800">
          <div className="flex-1 p-12 md:p-20 flex flex-col justify-center text-white relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10">
              <h4 className="text-blue-400 font-semibold tracking-wider uppercase mb-2">Get Started</h4>
              <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
              <p className="text-slate-300 text-lg mb-10">Have questions about our programs or need help choosing the right tutor? Send us a message and we'll get back to you shortly.</p>
              <Link href="/live-class" className="inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition">
                Book a Session Now
              </Link>
            </div>
          </div>
          
          <div className="flex-1 p-12 md:p-20 bg-white dark:bg-slate-900 m-2 rounded-[2rem] transition-colors duration-300">
            <form className="space-y-6 flex flex-col" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">How do you want to study?</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none">
                  <option>1:1 Coaching</option>
                  <option>Group Classes</option>
                  <option>Self Paced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <textarea rows={4} placeholder="Tell us about your goals..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"></textarea>
              </div>
              <div className="flex items-start gap-3 py-2">
                <input type="checkbox" id="consent" className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <label htmlFor="consent" className="text-sm text-slate-500">I agree to the terms and conditions and privacy policy.</label>
              </div>
              <button type="submit" className="w-full px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      
    </div>
  );
}