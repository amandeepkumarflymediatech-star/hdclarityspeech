'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from "@/../public/logo.png";
import { ArrowRight, Mail, Lock, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setStatus('error');
        setErrorMessage(res.error);
      } else {
        // Fetch session to determine role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else if (session?.user?.role === 'TUTOR') {
          router.push('/tutor');
        } else if (session?.user?.role === 'STUDENT') {
          router.push('/student');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong.');
    }
  };



  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-none shadow-xl overflow-hidden flex flex-col md:flex-row border border-secondary">
        
        {/* Left Form Section */}
        <div ref={formRef} className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl font-black text-primary mb-3 font-playfair tracking-tight">
              Welcome Back
            </h1>
            <p className="text-primary/70 font-sans text-lg">
              Sign in to your dashboard to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
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

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-primary uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-accent hover:text-primary transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary/50" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-8 pr-4 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors duration-200 outline-none text-lg placeholder-primary/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-accent text-accent text-sm rounded-none">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-primary text-white font-bold py-5 px-8 transition-colors duration-200 shadow-sm group disabled:opacity-70 mt-8 uppercase tracking-widest text-sm rounded-none"
            >
              <span>{status === 'loading' ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center text-primary/70 font-sans text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-accent font-bold hover:text-primary transition-colors">
              Sign up
            </Link>
          </div>
          
        </div>

        {/* Right Image/Testimonial Section */}
        <div ref={imageRef} className="hidden md:flex w-full md:w-1/2 bg-secondary p-12 relative overflow-hidden items-center justify-center border-l border-secondary">
          <div className="absolute inset-0 z-0">
            <Image src="/student-learning.png" alt="Student Learning" fill priority sizes="50vw" className="object-cover grayscale contrast-125 opacity-40 mix-blend-overlay" />
            <div className="absolute inset-0 bg-secondary/40 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 max-w-md">
            <h2 className="text-5xl font-black text-primary mb-10 leading-tight font-playfair tracking-tight">
              Pick up exactly where you left off.
            </h2>
            
            <ul className="space-y-6">
              {[
                'Review your upcoming sessions',
                'Access your custom curriculum',
                'Track your progress milestones',
              ].map((item, i) => (
                <li key={i} className="flex items-center text-primary font-sans text-lg font-bold">
                  <div className="w-8 h-8 rounded-none bg-white border border-primary/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-16 p-8 bg-white/80 backdrop-blur-md border-l-4 border-accent rounded-none shadow-sm">
              <p className="text-primary text-lg italic mb-6 font-cormorant">
                "The dashboard makes it so incredibly easy to track my progress and join my scheduled sessions with a single click."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-none flex items-center justify-center font-bold text-xl font-playfair">
                  M
                </div>
                <div>
                  <div className="text-primary font-bold font-sans">Marcus Chen</div>
                  <div className="text-primary/70 text-xs font-sans uppercase tracking-widest mt-1">Design Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}