'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CheckCircle2, ChevronDown, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studyPreference: '1:1 Coaching',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', studyPreference: '1:1 Coaching', message: '' });
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div ref={container} className="w-full font-sans text-primary bg-white transition-colors duration-300">

      {/* 1. Hero Section */}
      <section className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center text-center bg-secondary min-h-screen justify-center">
        <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase mb-6 text-primary font-sans animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Welcome to a space
        </h2>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl leading-[1.1] mb-12 text-primary font-playfair animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          where speaking clearly isn't a skill...
        </h1>

        <p className="text-lg md:text-xl text-primary/80 max-w-4xl mx-auto mb-12 leading-relaxed font-sans font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          it's your sharpest weapon. Where every word is delivered with unshakable conviction. Where every room you walk into becomes yours to command. This isn't about finding your voice, it's about owning it completely, in HD.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <Link href="/live-class" className="px-10 py-5 bg-accent hover:bg-primary text-white font-bold rounded-none shadow-sm transition-all w-full sm:w-auto text-lg uppercase tracking-wider">
            Start Learning
          </Link>
          <Link href="/about" className="px-10 py-5 bg-transparent border-2 border-primary hover:bg-primary text-primary hover:text-white font-bold rounded-none transition-all w-full sm:w-auto text-lg uppercase tracking-wider">
            Our Mission
          </Link>
        </div>
      </section>

      {/* 2. Value Proposition */}
      <section className="px-6 py-32 bg-white transition-colors duration-300 border-t border-secondary">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-3xl md:text-5xl font-playfair leading-tight text-primary transition-colors duration-300">
            "Your voice is the only instrument you'll play every single day. <span className="text-accent italic font-cormorant">It's time to tune it.</span>"
          </p>
        </div>
      </section>

      {/* 3. How It Works (Sticky Cards) */}
      <section className="px-6 py-32 bg-white transition-colors duration-300 border-t border-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="mb-20 text-center">
            <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans">The HD Method</h4>
            <h2 className="text-5xl md:text-6xl font-black text-primary font-playfair tracking-tight transition-colors duration-300">Command The Room</h2>
            <p className="text-primary/70 mt-6 text-xl max-w-2xl mx-auto font-sans">Your journey to absolute clarity in 3 definitive steps.</p>
          </div>

          <div className="cards-container relative flex flex-col gap-12">
            {/* Card 1 */}
            <div className="sticky-card bg-white p-12 md:p-16 border border-secondary rounded-none shadow-sm flex flex-col md:flex-row items-center justify-between gap-12 w-full z-10 transform origin-top">
              <div className="flex-1">
                <span className="text-secondary font-black text-6xl mb-6 block font-playfair">01</span>
                <h3 className="text-4xl font-bold mb-6 text-primary font-playfair tracking-tight">Assess & Align</h3>
                <p className="text-primary/80 mb-8 text-lg font-sans leading-relaxed">Sign up in minutes. We'll dive deep into your current speaking habits, identify the friction points, and establish exactly what absolute clarity looks like for you.</p>
                <Link href="/signup" className="inline-flex px-8 py-4 bg-primary text-white font-bold uppercase tracking-wider text-sm hover:bg-accent transition-colors">Begin Assessment</Link>
              </div>
              <div className="flex-1 w-full relative aspect-square md:aspect-video overflow-hidden bg-secondary">
                <Image src="/student-learning.png" alt="Create Account" fill className="object-cover mix-blend-multiply grayscale contrast-125 opacity-70" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="sticky-card bg-white p-12 md:p-16 border border-secondary rounded-none shadow-sm flex flex-col md:flex-row items-center justify-between gap-12 w-full z-20 transform origin-top">
              <div className="flex-1">
                <span className="text-secondary font-black text-6xl mb-6 block font-playfair">02</span>
                <h3 className="text-4xl font-bold mb-6 text-primary font-playfair tracking-tight">The 1:1 Crucible</h3>
                <p className="text-primary/80 mb-8 text-lg font-sans leading-relaxed">Lock in your sessions. No generic courses. You get intense, personalized coaching designed to strip away the noise and forge your delivery.</p>
                <Link href="/live-class" className="inline-flex px-8 py-4 bg-primary text-white font-bold uppercase tracking-wider text-sm hover:bg-accent transition-colors">View Mentors</Link>
              </div>
              <div className="flex-1 w-full relative aspect-square md:aspect-video overflow-hidden bg-secondary">
                <Image src="/tutor-call.png" alt="Book 1:1 Session" fill className="object-cover mix-blend-multiply grayscale contrast-125 opacity-70" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="sticky-card bg-white p-12 md:p-16 border border-secondary rounded-none shadow-sm flex flex-col md:flex-row items-center justify-between gap-12 w-full z-30 transform origin-top">
              <div className="flex-1">
                <span className="text-secondary font-black text-6xl mb-6 block font-playfair">03</span>
                <h3 className="text-4xl font-bold mb-6 text-primary font-playfair tracking-tight">Execute in HD</h3>
                <p className="text-primary/80 mb-8 text-lg font-sans leading-relaxed">Walk into your next meeting, presentation, or negotiation with unshakable conviction. The room is yours.</p>
                <Link href="/live-class" className="inline-flex px-8 py-4 bg-accent text-white font-bold uppercase tracking-wider text-sm hover:bg-primary transition-colors">Start Learning</Link>
              </div>
              <div className="flex-1 w-full relative aspect-square md:aspect-video overflow-hidden bg-secondary">
                <Image src="/student-success.png" alt="Learn & Grow" fill className="object-cover mix-blend-multiply grayscale contrast-125 opacity-70" />
              </div>
            </div>

            {/* Invisible spacer so we can scroll past the pinned cards smoothly */}
            <div className="h-[20vh]"></div>
          </div>
        </div>
      </section>

      {/* 4. What We Offer (Accordions) */}
      <section className="px-6 py-32 bg-secondary transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm font-sans text-center">The Arsenal</h4>
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-16 text-center font-playfair tracking-tight">What We Offer</h2>

          <div className="flex flex-col gap-6">
            {[
              { title: '1:1 Coaching', content: 'Get personalized guidance through live one-on-one sessions customized entirely to your learning goals and speed.' },
              { title: 'Live Workshops', content: 'Join interactive group sessions and live classes where you can learn alongside a community of peers.' },
              { title: 'Student Dashboard', content: 'Track progress, access purchased content, and manage your upcoming schedule all from a central hub.' },
              { title: 'Flexible Scheduling', content: 'Book sessions at your convenience. We match you with experts across different timezones to fit your busy life.' },
              { title: 'Community Support', content: 'Connect with mentors and fellow learners in our exclusive community forums and chat channels.' }
            ].map((item, i) => (
              <div key={i} className="accordion-item border border-primary/20 bg-white transition-colors duration-300 rounded-none">
                <button className="accordion-header w-full flex items-center justify-between p-8 text-left hover:bg-secondary/30 transition cursor-pointer">
                  <span className="text-2xl font-bold text-primary font-playfair tracking-tight">{item.title}</span>
                  <ChevronDown className="accordion-icon text-accent" />
                </button>
                <div className="accordion-content h-0 overflow-hidden opacity-0 border-t border-primary/10">
                  <div className="p-8 text-primary/80 font-sans text-lg leading-relaxed">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us (Grid) */}
      <section className="px-6 py-32 bg-white text-primary transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <h4 className="text-accent font-bold tracking-widest uppercase mb-4 font-sans text-sm">The Advantage</h4>
            <h2 className="text-5xl md:text-6xl font-black font-playfair tracking-tight">Learn Smarter. Grow Faster.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: 'Personalized Sessions', desc: 'Custom curriculum tailored exactly to your strengths and weaknesses.' },
              { title: 'Flexible Scheduling', desc: 'Find times that work for you, no matter your timezone or routine.' },
              { title: 'One-on-One Attention', desc: 'Undivided focus from expert instructors dedicated to your success.' },
              { title: 'Online Convenience', desc: 'Learn from the comfort of your home using seamless integrations.' }
            ].map((feature, i) => (
              <div key={i} className="bg-white border border-secondary p-10 transition-colors duration-300 hover:bg-secondary/30">
                <CheckCircle2 className="text-accent w-12 h-12 mb-8" />
                <h3 className="text-2xl font-bold mb-4 font-playfair tracking-tight">{feature.title}</h3>
                <p className="text-primary/80 font-sans leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. About Preview */}
      <section className="px-6 py-32 bg-secondary transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 space-y-10">
            <div>
              <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans">About us</h4>
              <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight font-playfair tracking-tight">Personalized Support That Fits Your Schedule.</h2>
            </div>
            <p className="text-xl text-primary/80 font-sans leading-relaxed">
              We believe education shouldn't be one-size-fits-all. Our platform connects you with dedicated professionals who adapt to your learning style, ensuring you acquire the skills you need efficiently.
            </p>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-primary font-bold font-sans text-lg">
                <div className="w-10 h-10 border border-primary flex items-center justify-center text-accent bg-white">
                  <CheckCircle2 size={20} />
                </div>
                Expert Guidance
              </li>
              <li className="flex items-center gap-4 text-primary font-bold font-sans text-lg">
                <div className="w-10 h-10 border border-primary flex items-center justify-center text-accent bg-white">
                  <CheckCircle2 size={20} />
                </div>
                Flexible Access
              </li>
              <li className="flex items-center gap-4 text-primary font-bold font-sans text-lg">
                <div className="w-10 h-10 border border-primary flex items-center justify-center text-accent bg-white">
                  <CheckCircle2 size={20} />
                </div>
                Real Results
              </li>
            </ul>
            <div className="pt-8">
              <Link href="/about" className="px-10 py-5 bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-wider text-sm transition inline-block">
                More About Us
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative aspect-[4/3] flex items-center justify-center overflow-hidden border border-secondary bg-white">
            <Image src="/team-office.png" alt="Our Team" fill className="object-cover grayscale mix-blend-multiply opacity-80" />
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-32 bg-white overflow-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 mb-20 text-center">
          <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans">Testimonials</h4>
          <h2 className="text-5xl md:text-6xl font-black text-primary font-playfair tracking-tight transition-colors duration-300">Success Stories</h2>
        </div>

        <div className="flex gap-8 px-6 pb-12 overflow-x-auto snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {[
            { name: 'Mazin', country: 'Saudi Arabia', text: 'The 1:1 sessions completely changed my approach. I gained confidence in just 3 weeks!' },
            { name: 'Tarun', country: 'India', text: 'Flexible scheduling allowed me to learn while working full time. Highly recommend to everyone.' },
            { name: 'Sarah', country: 'USA', text: 'My tutor was exceptionally patient and tailored every lesson to my exact career goals.' },
            { name: 'Aisha', country: 'UAE', text: 'The dashboard makes tracking my progress so easy. Worth every penny.' },
          ].map((t, i) => (
            <div key={i} className="snap-center shrink-0 w-80 md:w-[450px] bg-white border border-secondary p-10 md:p-14 relative transition-all duration-300 group hover:shadow-lg">
              <div className="absolute top-8 left-8 text-8xl font-playfair text-secondary/30 pointer-events-none transition-colors">"</div>
              <div className="flex text-accent mb-8 relative z-10">
                {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
              </div>
              <p className="text-primary mb-10 text-2xl md:text-3xl font-cormorant italic leading-relaxed relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-secondary text-primary rounded-none flex items-center justify-center font-bold text-xl font-playfair">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-primary text-xl font-sans tracking-tight">{t.name}</h4>
                  <p className="text-sm text-primary/70 font-sans mt-1 uppercase tracking-wider">{t.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Contact Form (CTA Promotional Section) */}
      <section className="px-6 py-32 bg-primary transition-colors duration-300">
        <div className="max-w-6xl mx-auto rounded-none overflow-hidden flex flex-col md:flex-row relative bg-primary">
          <div className="flex-1 p-12 md:p-20 flex flex-col justify-center text-white relative z-10">
            <h4 className="text-secondary font-bold tracking-widest uppercase mb-4 text-sm font-sans">Get Started</h4>
            <h2 className="text-4xl md:text-5xl font-black mb-8 font-playfair tracking-tight text-white">Ready to Command the Room?</h2>
            <p className="text-white/80 text-lg md:text-xl mb-12 font-sans leading-relaxed">Have questions about our mentorship or need help finding the right match? Send us a message and we'll secure your position.</p>
            <Link href="/live-class" className="inline-flex items-center justify-center px-10 py-5 bg-accent hover:bg-white text-white hover:text-primary font-bold uppercase tracking-wider text-sm transition-all max-w-max">
              Book a Session Now
            </Link>
          </div>

          <div className="flex-1 p-12 md:p-20 bg-white border border-secondary m-2 transition-colors duration-300 relative z-10">
            {submitStatus === 'success' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white z-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary text-white flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-black text-primary mb-4 font-playfair tracking-tight">Message Received.</h3>
                <p className="text-primary/70 text-center text-lg font-sans">
                  We'll review your inquiry and reach out shortly.
                </p>
                <button onClick={() => setSubmitStatus('idle')} className="mt-10 text-accent font-bold uppercase tracking-wider text-sm hover:underline">
                  Send another message
                </button>
              </div>
            ) : null}

            <form className={`space-y-8 flex flex-col transition-opacity font-sans ${submitStatus === 'success' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onSubmit={handleContactSubmit}>
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-accent text-sm border-l-4 border-accent font-medium">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-widest">Full Name</label>
                <input required type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-0 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors text-lg font-medium placeholder-primary/30" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-widest">Email Address</label>
                <input required type="email" placeholder="you@domain.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-0 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors text-lg font-medium placeholder-primary/30" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-widest">How do you want to study?</label>
                <select required value={formData.studyPreference} onChange={(e) => setFormData({ ...formData, studyPreference: e.target.value })} className="w-full px-0 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors text-lg font-medium">
                  <option value="1:1 Coaching">1:1 Coaching</option>
                  <option value="Group Classes">Group Classes</option>
                  <option value="Self Paced">Self Paced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-widest">Message</label>
                <textarea required rows={4} placeholder="Your goals..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-0 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors text-lg font-medium placeholder-primary/30 resize-none"></textarea>
              </div>
              <div className="flex items-start gap-4 pt-4">
                <input required type="checkbox" id="consent" className="mt-1 w-5 h-5 text-accent border-secondary focus:ring-accent rounded-none cursor-pointer" />
                <label htmlFor="consent" className="text-sm text-primary/80 leading-relaxed cursor-pointer">I commit to the terms and agree to the privacy policy.</label>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full px-8 py-5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4">
                {isSubmitting ? 'Transmitting...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}