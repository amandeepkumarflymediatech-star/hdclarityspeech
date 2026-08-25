'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from "@/../public/logo.png";
import { ArrowRight, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import gsap from 'gsap';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const formRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('idle');
        toast.error(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('idle');
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-none shadow-xl overflow-hidden flex flex-col md:flex-row border border-secondary">
        
        {/* Left Form Section */}
        <div ref={formRef} className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
          <Link href="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs tracking-widest uppercase mb-8 transition-colors self-start">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl font-black text-primary mb-3 font-playfair tracking-tight">
              Reset Password
            </h1>
            <p className="text-primary/70 font-sans text-lg">
              Enter your email and we'll send you instructions to reset your password.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-secondary/30 text-primary p-8 border border-secondary text-center">
              <div className="w-16 h-16 bg-white border border-secondary flex items-center justify-center mx-auto mb-6 rounded-full shadow-sm">
                 <Mail className="w-8 h-8 text-accent" />
              </div>
              <p className="font-bold text-2xl mb-2 font-playfair tracking-tight">Check your email</p>
              <p className="text-primary/70 font-sans text-lg mb-8">{message}</p>
              <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-primary text-white font-bold py-4 px-8 transition-colors duration-200 uppercase tracking-widest text-sm shadow-sm group">
                Return to Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-primary/50" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-8 pr-4 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors duration-200 outline-none text-lg placeholder-primary/30"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-primary text-white font-bold py-5 px-8 transition-colors duration-200 shadow-sm group disabled:opacity-70 mt-8 uppercase tracking-widest text-sm rounded-none"
              >
                <span>{status === 'loading' ? 'Sending Link...' : 'Send Reset Link'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-primary/70 font-sans text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-accent font-bold hover:text-primary transition-colors">
              Log in
            </Link>
          </div>
          
        </div>

        {/* Right Image/Testimonial Section */}
        <div ref={imageRef} className="hidden md:flex w-full md:w-1/2 bg-secondary p-12 relative overflow-hidden items-center justify-center border-l border-secondary">
          <div className="absolute inset-0 z-0 bg-primary">
            <Image src="/student-learning.png" alt="Student Learning" fill priority sizes="50vw" className="object-cover grayscale contrast-125 opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 max-w-md text-white">
            <div className="w-16 h-16 bg-accent rounded-none flex items-center justify-center mb-8 shadow-lg">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-black mb-10 leading-tight font-playfair tracking-tight text-white">
              Secure your learning journey.
            </h2>
            
            <p className="text-white/80 font-sans text-lg mb-8 leading-relaxed">
              We understand that passwords can be forgotten. Don't worry, we've got you covered. A simple email verification is all it takes to regain access to your personalized curriculum and upcoming sessions.
            </p>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/90 text-lg italic mb-6 font-cormorant">
                "HD Clarity made it so simple to jump back into my classes when I lost my access. Within minutes I was ready to learn again."
              </p>
              {/* <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white text-primary rounded-none flex items-center justify-center font-bold text-xl font-playfair">
                  S
                </div>
                <div>
                  <div className="text-white font-bold font-sans">Sarah Jenkins</div>
                  <div className="text-white/60 text-xs font-sans uppercase tracking-widest mt-1">Student</div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
