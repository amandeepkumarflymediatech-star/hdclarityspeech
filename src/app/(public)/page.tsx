// 'use client';

// import React, { useRef, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useGSAP } from '@gsap/react';
// import { CheckCircle2, ChevronDown, Star } from 'lucide-react';

// gsap.registerPlugin(ScrollTrigger);

// export default function HomePage() {
//   const container = useRef<HTMLDivElement>(null);

//   // Contact Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     studyPreference: '1:1 Coaching',
//     message: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleContactSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus('idle');
//     setErrorMessage('');

//     try {
//       const res = await fetch('/api/contact', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to send message');
//       }

//       setSubmitStatus('success');
//       setFormData({ name: '', email: '', studyPreference: '1:1 Coaching', message: '' });
//     } catch (error: any) {
//       setSubmitStatus('error');
//       setErrorMessage(error.message || 'An error occurred.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useGSAP(() => {
//     // Stacking cards animation
//     const cards = gsap.utils.toArray('.sticky-card');

//     cards.forEach((card: any, index: number) => {
//       ScrollTrigger.create({
//         trigger: card,
//         start: `top ${100 + index * 40}px`, // Offset each card
//         endTrigger: '.cards-container',
//         end: 'bottom bottom',
//         pin: true,
//         pinSpacing: false,
//       });
//     });

//     // Accordion animation
//     const accordions = gsap.utils.toArray('.accordion-item');
//     accordions.forEach((acc: any) => {
//       const header = acc.querySelector('.accordion-header');
//       const content = acc.querySelector('.accordion-content');
//       const icon = acc.querySelector('.accordion-icon');

//       let isOpen = false;
//       const tween = gsap.to(content, {
//         height: 'auto',
//         opacity: 1,
//         duration: 0.3,
//         paused: true,
//       });
//       const iconTween = gsap.to(icon, {
//         rotation: 180,
//         duration: 0.3,
//         paused: true,
//       });

//       header.addEventListener('click', () => {
//         if (!isOpen) {
//           tween.play();
//           iconTween.play();
//         } else {
//           tween.reverse();
//           iconTween.reverse();
//         }
//         isOpen = !isOpen;
//       });
//     });
//   }, { scope: container });

//   return (
//     <div ref={container} className="w-full font-sans text-primary bg-white transition-colors duration-300">

//       {/* 1. Hero Section */}
//       <section className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-secondary min-h-screen flex items-center">
//         {/* Abstract background shapes */}
//         <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[200px] -z-0"></div>
//         <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-0"></div>

//         <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
//           <div className="flex flex-col items-start text-left">
//             <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm border border-primary/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
//               <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
//               <span className="text-sm font-bold tracking-widest uppercase text-primary font-sans">
//                 Master Your Delivery
//               </span>
//             </div>

//             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8 text-primary font-playfair animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
//               Speak clearly.<br />
//               <span className="text-accent italic font-cormorant">Command</span> the room.
//             </h1>

//             <p className="text-lg md:text-xl text-primary/80 mb-10 leading-relaxed font-sans font-medium max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
//               Your voice is your sharpest weapon. Transform every presentation, negotiation, and meeting into an undeniable statement of your authority.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
//               <Link href="/live-class" className="px-8 py-4 bg-accent hover:bg-primary text-white font-bold rounded-none shadow-sm transition-all w-full sm:w-auto text-center text-sm uppercase tracking-wider">
//                 Start Learning
//               </Link>
//               <Link href="/about" className="px-8 py-4 bg-transparent border-2 border-primary hover:bg-primary text-primary hover:text-white font-bold rounded-none transition-all w-full sm:w-auto text-center text-sm uppercase tracking-wider flex items-center justify-center gap-2">
//                 Discover the Method
//               </Link>
//             </div>
            
//             <div className="mt-12 flex items-center gap-4 animate-in fade-in duration-1000 delay-700 fill-mode-both">
//                <div className="flex -space-x-4">
//                  {[1, 2, 3].map((i) => (
//                     <div key={i} className="w-10 h-10 rounded-full border-2 border-secondary bg-primary flex items-center justify-center text-white text-xs font-bold">
//                       <Star size={12} />
//                     </div>
//                  ))}
//                </div>
//                <div className="text-sm font-medium text-primary/70">
//                  Join <span className="font-bold text-primary">500+</span> professionals
//                </div>
//             </div>
//           </div>

//           <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both mt-12 lg:mt-0">
//             {/* Image Composition */}
//             <div className="absolute inset-0 bg-primary/5 border border-primary/10 transform rotate-3 transition-transform hover:rotate-0 duration-500"></div>
//             <div className="absolute inset-0 bg-white border border-secondary shadow-2xl p-4 transform -rotate-2 transition-transform hover:rotate-0 duration-500 flex flex-col">
//               <div className="relative flex-1 overflow-hidden bg-secondary mb-4">
//                 <Image 
//                   src="/student-learning.png" 
//                   alt="Student mastering speech" 
//                   fill 
//                   className="object-cover mix-blend-multiply grayscale contrast-125 opacity-90 hover:scale-105 transition-transform duration-700"
//                   priority
//                 />
//               </div>
//               <div className="flex items-center justify-between px-4 pb-2">
//                  <div>
//                     <p className="font-playfair font-bold text-primary text-lg">1:1 Mentorship</p>
//                     <p className="font-sans text-primary/60 text-sm">Personalized Feedback</p>
//                  </div>
//                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center text-accent">
//                     <Star size={24} />
//                  </div>
//               </div>
//             </div>
            
//             {/* Floating Badge */}
//             <div className="absolute -left-4 sm:-left-8 top-1/4 bg-white p-4 border border-secondary shadow-lg animate-bounce duration-[3000ms] z-20">
//                <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-accent text-white flex items-center justify-center">
//                     <CheckCircle2 size={20} />
//                   </div>
//                   <div>
//                     <p className="font-bold font-sans text-sm text-primary">HD Clarity</p>
//                     <p className="text-xs text-primary/60 uppercase tracking-wider">Methodology</p>
//                   </div>
//                </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 2. The Problem vs. The Solution */}
//       <section className="px-6 py-32 bg-primary transition-colors duration-300 border-t border-secondary overflow-hidden">
//         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
//           <div className="flex-1 text-white relative z-10">
//             <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans flex items-center gap-2">
//               <span className="w-8 h-[2px] bg-accent"></span> The Reality
//             </h4>
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-playfair tracking-tight mb-8">
//               The Promotion Went to the <span className="text-accent italic font-cormorant">Better Speaker.</span>
//             </h2>
//             <p className="text-white/80 text-xl font-sans leading-relaxed mb-8">
//               It doesn't matter how good your ideas are if you can't articulate them. Poor delivery creates a ceiling on your career.
//             </p>
//             <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md">
//               <p className="text-white font-bold font-sans text-lg mb-4">Here's why you're stuck:</p>
//               <ul className="space-y-4 text-white/80 font-sans">
//                 <li className="flex items-center gap-4"><CheckCircle2 className="text-accent w-6 h-6 shrink-0" /> <span className="text-lg">Overthinking before speaking</span></li>
//                 <li className="flex items-center gap-4"><CheckCircle2 className="text-accent w-6 h-6 shrink-0" /> <span className="text-lg">Losing the room's attention</span></li>
//                 <li className="flex items-center gap-4"><CheckCircle2 className="text-accent w-6 h-6 shrink-0" /> <span className="text-lg">Sounding unsure of your expertise</span></li>
//               </ul>
//             </div>
//           </div>
//           <div className="flex-1 w-full relative">
//             {/* Background glowing orb */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
            
//             <div className="relative aspect-[4/5] sm:aspect-square w-full max-w-md mx-auto z-10 rounded-none overflow-hidden border border-white/10 shadow-2xl group bg-secondary">
//                <Image 
//                  src="/hero-img.webp" 
//                  alt="Client image placeholder" 
//                  fill 
//                  className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100" 
//                />
//                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90"></div>
//                <div className="absolute bottom-0 left-0 w-full p-10">
//                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-xs font-bold uppercase tracking-wider mb-4">
//                      The Solution
//                   </div>
//                   <p className="text-3xl font-bold text-white font-playfair mb-3">Command The Room</p>
//                   <p className="text-white/80 font-sans text-base leading-relaxed">Turn your voice into your greatest asset with HD Clarity's proven methodology.</p>
//                </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 3. How It Works (Sticky Cards) */}
//       <section className="px-6 py-32 bg-primary transition-colors duration-300">
//         <div className="max-w-5xl mx-auto">
//           <div className="mb-20 text-center">
//             <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans">The HD Method</h4>
//             <h2 className="text-5xl md:text-6xl font-black text-white font-playfair tracking-tight">Command The Room</h2>
//             <p className="text-white/70 mt-6 text-xl max-w-2xl mx-auto font-sans">Your journey to absolute clarity in 3 definitive steps.</p>
//           </div>

//           <div className="cards-container relative flex flex-col gap-16">
//             {/* Card 1 */}
//             <div className="sticky-card bg-secondary p-12 md:p-16 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 w-full z-10 transform origin-top border border-white/10">
//               <div className="flex-1">
//                 <span className="text-accent font-black text-6xl md:text-8xl mb-6 block font-playfair opacity-50">01</span>
//                 <h3 className="text-4xl font-bold mb-6 text-primary font-playfair tracking-tight">Assess & Align</h3>
//                 <p className="text-primary/80 mb-8 text-lg font-sans leading-relaxed">Sign up in minutes. We'll dive deep into your current speaking habits, identify the friction points, and establish exactly what absolute clarity looks like for you.</p>
//                 <Link href="/signup" className="inline-flex px-8 py-4 bg-primary text-white font-bold uppercase tracking-wider text-sm hover:bg-accent transition-colors">Begin Assessment</Link>
//               </div>
//               <div className="flex-1 w-full relative aspect-square md:aspect-video overflow-hidden rounded-xl bg-white">
//                 <Image src="/student-learning.png" alt="Create Account" fill className="object-cover mix-blend-multiply grayscale contrast-125 opacity-90" />
//               </div>
//             </div>

//             {/* Card 2 */}
//             <div className="sticky-card bg-white p-12 md:p-16 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 w-full z-20 transform origin-top border border-primary/10">
//               <div className="flex-1">
//                 <span className="text-accent font-black text-6xl md:text-8xl mb-6 block font-playfair opacity-50">02</span>
//                 <h3 className="text-4xl font-bold mb-6 text-primary font-playfair tracking-tight">The 1:1 Crucible</h3>
//                 <p className="text-primary/80 mb-8 text-lg font-sans leading-relaxed">Lock in your sessions. No generic courses. You get intense, personalized coaching designed to strip away the noise and forge your delivery.</p>
//                 <Link href="/live-class" className="inline-flex px-8 py-4 bg-primary text-white font-bold uppercase tracking-wider text-sm hover:bg-accent transition-colors">View Mentors</Link>
//               </div>
//               <div className="flex-1 w-full relative aspect-square md:aspect-video overflow-hidden rounded-xl bg-secondary">
//                 <Image src="/tutor-call.png" alt="Book 1:1 Session" fill className="object-cover mix-blend-multiply grayscale contrast-125 opacity-90" />
//               </div>
//             </div>

//             {/* Card 3 */}
//             <div className="sticky-card bg-accent p-12 md:p-16 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 w-full z-30 transform origin-top border border-white/20 text-white">
//               <div className="flex-1">
//                 <span className="text-white font-black text-6xl md:text-8xl mb-6 block font-playfair opacity-50">03</span>
//                 <h3 className="text-4xl font-bold mb-6 font-playfair tracking-tight text-white">Execute in HD</h3>
//                 <p className="text-white/90 mb-8 text-lg font-sans leading-relaxed">Walk into your next meeting, presentation, or negotiation with unshakable conviction. The room is yours.</p>
//                 <Link href="/live-class" className="inline-flex px-8 py-4 bg-white text-accent font-bold uppercase tracking-wider text-sm hover:bg-primary hover:text-white transition-colors">Start Learning</Link>
//               </div>
//               <div className="flex-1 w-full relative aspect-square md:aspect-video overflow-hidden rounded-xl bg-primary">
//                 <Image src="/student-success.png" alt="Learn & Grow" fill className="object-cover opacity-80 mix-blend-luminosity" />
//               </div>
//             </div>

//             {/* Invisible spacer so we can scroll past the pinned cards smoothly */}
//             <div className="h-[20vh]"></div>
//           </div>
//         </div>
//       </section>

//       {/* 4. What We Offer (Bento Grid) */}
//       <section className="px-6 py-32 bg-secondary transition-colors duration-300">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-20">
//             <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans">The Arsenal</h4>
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary font-playfair tracking-tight">Everything you need to <br/>master your voice.</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
//              {/* Bento Item 1 - Large */}
//              <div className="md:col-span-2 md:row-span-2 bg-primary p-12 flex flex-col justify-between group overflow-hidden relative">
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-0 transition-transform duration-700 group-hover:scale-150"></div>
//                 <div className="relative z-10">
//                    <div className="w-16 h-16 bg-accent text-white flex items-center justify-center mb-8">
//                       <Star size={32} />
//                    </div>
//                    <h3 className="text-4xl font-bold text-white font-playfair mb-4">1:1 Elite Coaching</h3>
//                    <p className="text-white/70 text-lg font-sans max-w-md leading-relaxed">Get personalized guidance through live one-on-one sessions customized entirely to your learning goals and speed. No generic advice, just targeted feedback.</p>
//                 </div>
//                 <div className="relative w-full h-48 mt-8 overflow-hidden rounded-tl-3xl border-t border-l border-white/10 z-10">
//                    <Image src="/tutor-call.png" alt="1:1 Coaching" fill className="object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700" />
//                 </div>
//              </div>

//              {/* Bento Item 2 */}
//              <div className="bg-white border border-primary/10 p-8 flex flex-col justify-between group hover:border-accent transition-colors duration-300 shadow-sm">
//                 <div>
//                    <h3 className="text-2xl font-bold text-primary font-playfair mb-3">Live Workshops</h3>
//                    <p className="text-primary/70 font-sans text-sm leading-relaxed">Join interactive group sessions and learn alongside a community of driven peers.</p>
//                 </div>
//                 <div className="w-full h-32 bg-secondary rounded-none mt-6 relative overflow-hidden border border-primary/5">
//                    <Image src="/team-office.png" alt="Workshops" fill className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply grayscale" />
//                 </div>
//              </div>

//              {/* Bento Item 3 */}
//              <div className="bg-accent p-10 flex flex-col justify-center text-white group relative overflow-hidden">
//                 <div className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-500">
//                   <CheckCircle2 size={150} />
//                 </div>
//                 <h3 className="text-2xl font-bold font-playfair mb-3 relative z-10">Flexible Scheduling</h3>
//                 <p className="text-white/90 font-sans text-base mb-8 relative z-10 leading-relaxed">Book sessions at your convenience across different timezones.</p>
//                 <div className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase border-b border-white/50 pb-1 max-w-max group-hover:pr-4 group-hover:border-white transition-all relative z-10 cursor-pointer">
//                    View Schedule <ChevronDown size={16} className="-rotate-90" />
//                 </div>
//              </div>
             
//              {/* Bento Item 4 */}
//              <div className="md:col-span-3 bg-white border border-primary/10 p-12 flex flex-col md:flex-row items-center justify-between gap-12 hover:shadow-xl transition-shadow duration-500 shadow-sm">
//                 <div className="flex-1">
//                    <div className="w-12 h-12 bg-secondary text-primary flex items-center justify-center mb-6">
//                       <CheckCircle2 size={24} />
//                    </div>
//                    <h3 className="text-3xl font-bold text-primary font-playfair mb-4">Student Dashboard</h3>
//                    <p className="text-primary/70 font-sans text-lg leading-relaxed">Track progress, access purchased content, and manage your upcoming schedule all from a central, beautifully designed hub tailored to your journey.</p>
//                 </div>
//                 <div className="flex-1 w-full flex justify-end">
//                    <div className="w-full max-w-md h-48 bg-secondary rounded-none border border-primary/10 p-6 shadow-inner relative overflow-hidden flex flex-col gap-4">
//                       <div className="w-3/4 h-4 bg-white/60"></div>
//                       <div className="w-1/2 h-4 bg-white/40"></div>
//                       <div className="mt-auto h-16 bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold font-sans">Progress Metrics</div>
//                    </div>
//                 </div>
//              </div>
//           </div>
//         </div>
//       </section>

//       {/* 5. The Advantage & About */}
//       <section className="px-6 py-32 bg-white text-primary transition-colors duration-300 relative overflow-hidden border-t border-secondary">
//         <div className="absolute -left-40 top-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
//         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          
//           <div className="flex-1 space-y-10 relative z-10">
//             <div>
//               <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans flex items-center gap-2">
//                  <span className="w-8 h-[2px] bg-accent"></span> The Advantage
//               </h4>
//               <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-tight font-playfair tracking-tight">Learn Smarter.<br/>Grow Faster.</h2>
//             </div>
//             <p className="text-xl text-primary/70 font-sans leading-relaxed">
//               We believe education shouldn't be one-size-fits-all. Our platform connects you with dedicated professionals who adapt to your learning style, ensuring you acquire the skills you need efficiently.
//             </p>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
//                {[
//                  { title: 'Expert Guidance', desc: 'Custom curriculum tailored to your strengths.' },
//                  { title: 'Flexible Access', desc: 'Find times that work for your schedule.' },
//                  { title: 'Real Results', desc: 'Track your growth with tangible metrics.' },
//                  { title: 'Live Support', desc: 'Community forums and direct mentoring.' }
//                ].map((feature, i) => (
//                   <div key={i} className="flex flex-col gap-3 group">
//                      <div className="w-12 h-12 border border-primary/10 flex items-center justify-center text-accent bg-secondary group-hover:bg-accent group-hover:text-white transition-colors duration-300">
//                         <CheckCircle2 size={24} />
//                      </div>
//                      <h4 className="font-bold text-primary text-xl font-playfair">{feature.title}</h4>
//                      <p className="text-primary/60 font-sans text-sm">{feature.desc}</p>
//                   </div>
//                ))}
//             </div>

//             <div className="pt-8">
//               <Link href="/about" className="px-10 py-5 bg-primary text-white hover:bg-accent hover:text-white font-bold uppercase tracking-wider text-sm transition inline-block">
//                 Discover Our Story
//               </Link>
//             </div>
//           </div>

//           <div className="flex-1 w-full relative h-[600px] flex items-center justify-center z-10">
//              <div className="absolute inset-0 bg-primary/5 -rotate-6 transform rounded-3xl"></div>
//              <div className="absolute inset-0 bg-secondary border border-primary/10 overflow-hidden transform rotate-2 transition-transform duration-700 hover:rotate-0 rounded-3xl">
//                 <Image src="/team-office.png" alt="Our Team" fill className="object-cover mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-[2s]" />
//              </div>
             
//              <div className="absolute -bottom-6 -left-6 bg-white p-8 shadow-2xl border border-secondary flex items-center gap-6 animate-pulse duration-[3000ms]">
//                 <div className="text-5xl font-black font-playfair text-accent">100%</div>
//                 <div className="font-sans text-primary text-sm font-bold uppercase tracking-widest leading-relaxed">Dedicated<br/>Support</div>
//              </div>
//           </div>
//         </div>
//       </section>

//       {/* 6. Testimonials */}
//       <section className="py-32 bg-secondary overflow-hidden transition-colors duration-300">
//         <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col md:flex-row items-end justify-between gap-8">
//           <div>
//             <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans flex items-center gap-2">
//                <span className="w-8 h-[2px] bg-accent"></span> Success Stories
//             </h4>
//             <h2 className="text-5xl md:text-6xl font-black text-primary font-playfair tracking-tight">The Verdict</h2>
//           </div>
//           <p className="text-primary/70 font-sans text-lg max-w-sm leading-relaxed mb-2">
//              Don't just take our word for it. Hear from professionals who have transformed their careers through HD Clarity.
//           </p>
//         </div>

//         <div className="flex gap-8 px-6 pb-12 overflow-x-auto snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
//           {[
//             { name: 'Mazin', country: 'Saudi Arabia', text: 'The 1:1 sessions completely changed my approach. I gained confidence in just 3 weeks!' },
//             { name: 'Tarun', country: 'India', text: 'Flexible scheduling allowed me to learn while working full time. Highly recommend to everyone.' },
//             { name: 'Sarah', country: 'USA', text: 'My tutor was exceptionally patient and tailored every lesson to my exact career goals.' },
//             { name: 'Aisha', country: 'UAE', text: 'The dashboard makes tracking my progress so easy. Worth every penny.' },
//           ].map((t, i) => (
//             <div key={i} className="snap-center shrink-0 w-[85vw] sm:w-80 md:w-[450px] bg-white border border-primary/10 p-10 md:p-12 relative transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 rounded-2xl">
//               <div className="absolute -top-6 -left-2 text-9xl font-black font-playfair text-secondary pointer-events-none transition-colors group-hover:text-accent/10 z-0 opacity-50">"</div>
//               <div className="flex text-accent mb-8 relative z-10">
//                 {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
//               </div>
//               <p className="text-primary mb-10 text-xl md:text-2xl font-sans font-medium leading-relaxed relative z-10">"{t.text}"</p>
//               <div className="flex items-center gap-5 relative z-10 mt-auto">
//                 <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl font-playfair">
//                   {t.name.charAt(0)}
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-primary text-lg font-sans tracking-tight">{t.name}</h4>
//                   <p className="text-xs text-primary/50 font-bold font-sans mt-1 uppercase tracking-wider">{t.country}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 7. Contact Form (CTA Promotional Section) */}
//       <section className="px-6 py-32 bg-primary transition-colors duration-300 relative overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 via-primary to-primary"></div>
//         <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/10 shadow-2xl">
          
//           <div className="flex-1 p-12 md:p-20 flex flex-col justify-center bg-white/5 backdrop-blur-xl border-r border-white/10">
//             <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans">Get Started</h4>
//             <h2 className="text-4xl md:text-5xl font-black mb-8 font-playfair tracking-tight text-white">Ready to Command the Room?</h2>
//             <p className="text-white/70 text-lg md:text-xl mb-12 font-sans leading-relaxed">Have questions about our mentorship or need help finding the right match? Send us a message and we'll secure your position.</p>
//             <div className="space-y-4">
//                <div className="flex items-center gap-4 text-white/80">
//                   <CheckCircle2 className="text-accent" size={20} />
//                   <span>Guaranteed response within 24 hours</span>
//                </div>
//                <div className="flex items-center gap-4 text-white/80">
//                   <CheckCircle2 className="text-accent" size={20} />
//                   <span>Personalized consultation</span>
//                </div>
//             </div>
//           </div>

//           <div className="flex-1 p-12 md:p-20 bg-white relative">
//             {submitStatus === 'success' ? (
//               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white z-10 animate-in fade-in zoom-in duration-500">
//                 <div className="w-24 h-24 bg-accent/10 rounded-full text-accent flex items-center justify-center mb-6">
//                   <CheckCircle2 size={48} />
//                 </div>
//                 <h3 className="text-3xl font-black text-primary mb-4 font-playfair tracking-tight text-center">Message Received.</h3>
//                 <p className="text-primary/70 text-center text-lg font-sans max-w-xs">
//                   We'll review your inquiry and reach out shortly.
//                 </p>
//                 <button onClick={() => setSubmitStatus('idle')} className="mt-10 text-accent font-bold uppercase tracking-wider text-sm hover:underline">
//                   Send another message
//                 </button>
//               </div>
//             ) : null}

//             <form className={`space-y-6 flex flex-col transition-opacity font-sans ${submitStatus === 'success' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onSubmit={handleContactSubmit}>
//               {submitStatus === 'error' && (
//                 <div className="p-4 bg-red-50 text-accent text-sm border-l-4 border-accent font-medium rounded-r-md">
//                   {errorMessage}
//                 </div>
//               )}
//               <div className="space-y-2">
//                 <label className="block text-xs font-bold text-primary uppercase tracking-widest">Full Name</label>
//                 <input required type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-4 border border-secondary bg-secondary/30 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-base font-medium placeholder-primary/30" />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-xs font-bold text-primary uppercase tracking-widest">Email Address</label>
//                 <input required type="email" placeholder="you@domain.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-4 border border-secondary bg-secondary/30 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-base font-medium placeholder-primary/30" />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-xs font-bold text-primary uppercase tracking-widest">How do you want to study?</label>
//                 <select required value={formData.studyPreference} onChange={(e) => setFormData({ ...formData, studyPreference: e.target.value })} className="w-full px-4 py-4 border border-secondary bg-secondary/30 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-base font-medium">
//                   <option value="1:1 Coaching">1:1 Coaching</option>
//                   <option value="Group Classes">Group Classes</option>
//                   <option value="Self Paced">Self Paced</option>
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-xs font-bold text-primary uppercase tracking-widest">Message</label>
//                 <textarea required rows={4} placeholder="Your goals..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-4 border border-secondary bg-secondary/30 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-base font-medium placeholder-primary/30 resize-none"></textarea>
//               </div>
//               <div className="flex items-start gap-4 pt-2">
//                 <input required type="checkbox" id="consent" className="mt-1 w-5 h-5 text-accent border-secondary rounded focus:ring-accent cursor-pointer" />
//                 <label htmlFor="consent" className="text-sm text-primary/70 leading-relaxed cursor-pointer">I commit to the terms and agree to the privacy policy.</label>
//               </div>
//               <button disabled={isSubmitting} type="submit" className="w-full px-8 py-5 bg-primary hover:bg-accent text-white rounded-lg font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4 shadow-xl shadow-primary/20 hover:shadow-accent/30">
//                 {isSubmitting ? 'Transmitting...' : 'Send Message'}
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }





import React from 'react';
import HeroSection from './_components/home/HeroSection';
import TrustSection from './_components/home/TrustSection';
import TransformationSection from './_components/home/TransformationSection';
import MethodSection from './_components/home/MethodSection';
import ProgramsSection from './_components/home/ProgramsSection';
import TestimonialsSection from './_components/home/TestimonialsSection';
import FinalCtaSection from './_components/home/FinalCtaSection';

export default function HomePage() {
  return (
    <div className="w-full bg-[#F7F5F0]">
      <HeroSection />
      <TrustSection />
      <TransformationSection />
      <MethodSection />
      <ProgramsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
}

