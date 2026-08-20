'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Clock, DollarSign, Users, CheckCircle2, ArrowRight, UploadCloud } from 'lucide-react';
import gsap from 'gsap';
import Image from 'next/image';

export default function BecomeTutorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      featuresRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.4 }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', experience: '', bio: '' });
    }, 1500);
  };

  const benefits = [
    { icon: Clock, title: 'Flexible Schedule', desc: 'Work on your own terms. Set your availability and pick up sessions when it suits you best.' },
    { icon: DollarSign, title: 'Competitive Pay', desc: 'Earn top rates in the industry with weekly direct deposits and performance bonuses.' },
    { icon: Users, title: 'Impactful Work', desc: 'Make a real difference by helping students overcome speech challenges globally.' },
    { icon: Briefcase, title: 'Professional Growth', desc: 'Access exclusive resources, community forums, and continuous education opportunities.' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans pt-24 pb-20 transition-colors duration-300">

      {/* Hero Section */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-secondary text-primary font-bold text-sm mb-6 border border-primary/20 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          We're Hiring Speech Mentors
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-primary font-playfair tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
          Empower voices and build your career with <span className="text-accent">HD Clarity</span>.
        </h1>
        <p className="text-lg md:text-xl text-primary/80 font-sans max-w-2xl mx-auto leading-relaxed">
          Join our network of elite speech therapists and make a profound impact on students worldwide from the comfort of your home.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Left Side: Benefits */}
        <div ref={featuresRef} className="space-y-12">
          <div>
            <h2 className="text-3xl font-black text-primary mb-8 font-playfair tracking-tight">Why mentor with us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="group">
                  <div className="w-12 h-12 border border-secondary flex items-center justify-center text-accent mb-4 group-hover:scale-110 group-hover:bg-secondary transition-all duration-300">
                    <benefit.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2 font-playfair">{benefit.title}</h3>
                  <p className="text-sm text-primary/80 leading-relaxed font-sans">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary p-8 relative overflow-hidden text-primary border-l-4 border-accent">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CheckCircle2 size={120} className="transform translate-x-8 -translate-y-8 text-primary" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 font-playfair tracking-tight">"The best platform for speech mentors."</h3>
              <p className="text-primary/90 mb-6 italic text-sm md:text-base font-cormorant text-lg">
                "Working with HD Clarity has given me the flexibility to travel while continuing my practice. The platform handles all the billing and scheduling seamlessly."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-xl font-playfair">
                  K
                </div>
                <div>
                  <div className="font-bold text-primary font-sans">Dr. K. Reynolds</div>
                  <div className="text-primary/70 text-xs font-sans uppercase tracking-widest mt-1">Senior Mentor, 2+ Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Application Form */}
        <div ref={formRef} className="bg-white border border-secondary p-8 sm:p-12 border-t-4 border-t-accent">
          <h2 className="text-3xl font-black text-primary mb-2 font-playfair tracking-tight">Apply Now</h2>
          <p className="text-primary/70 text-sm mb-10 font-sans">Takes less than 3 minutes to complete.</p>

          {isSuccess ? (
            <div className="bg-white border border-secondary p-10 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-primary text-white flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-primary mb-4 font-playfair tracking-tight">Application Received.</h3>
              <p className="text-primary/80 text-sm font-sans leading-relaxed">
                Thank you for applying. Our team will review your application and get back to you within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 font-sans">
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full px-0 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors duration-200 outline-none placeholder-primary/30 text-lg"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full px-0 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors duration-200 outline-none placeholder-primary/30 text-lg"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Years of Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="block w-full px-0 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors duration-200 outline-none text-lg [&>option]:bg-white"
                    required
                  >
                    <option value="" disabled>Select your experience</option>
                    <option value="1-3">1-3 years</option>
                    <option value="4-7">4-7 years</option>
                    <option value="8+">8+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Resume / CV</label>
                  <div className="border-2 border-dashed border-secondary p-8 flex flex-col items-center justify-center text-center hover:border-accent hover:bg-secondary/30 transition cursor-pointer group bg-white">
                    <div className="w-12 h-12 bg-secondary flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition shadow-sm">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-bold text-primary uppercase tracking-wider">Click to upload</p>
                    <p className="text-xs text-primary/70 mt-2">PDF, DOCX up to 10MB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Why do you want to join?</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="block w-full px-0 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors duration-200 outline-none placeholder-primary/30 text-lg resize-none"
                    placeholder="Tell us a little about yourself..."
                    required
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-primary text-white font-bold py-5 px-8 transition-colors duration-200 group disabled:opacity-70 mt-8 uppercase tracking-widest text-sm rounded-none"
              >
                <span>{isSubmitting ? 'Transmitting...' : 'Submit Application'}</span>
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
