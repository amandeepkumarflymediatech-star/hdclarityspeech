'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from "@/../public/logo.png";
import { ArrowRight, Mail, Lock, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const role = 'TUTOR';
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState(urlError || '');
  const router = useRouter();

  const formRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (urlError) {
      toast.error(urlError);
    }
  }, [urlError]);

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
        role,
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
        <div ref={formRef} className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
          <Link href="/login" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs tracking-widest uppercase mb-8 transition-colors self-start">
            <ArrowLeft size={16} /> Back to Home
          </Link>

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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-8 pr-10 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors duration-200 outline-none text-lg placeholder-primary/30"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-primary/50 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-accent text-accent text-sm rounded-none">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-primary text-white font-bold py-5 px-8 transition-colors duration-200 shadow-sm group disabled:opacity-70 mt-8 uppercase tracking-widest text-sm rounded-none"
              >
                <span>{status === 'loading' ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  document.cookie = `intendedRole=${role}; path=/; max-age=300`;
                  signIn('google', { callbackUrl: '/auth-callback' });
                }}
                className="w-full bg-white border-2 border-secondary text-primary py-3.5 font-bold uppercase tracking-widest text-xs hover:border-primary transition-colors flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-primary/70 font-sans text-sm">
            Don't have an account?{' '}
            <Link href="/tutor/signup" className="text-accent font-bold hover:text-primary transition-colors">
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-secondary flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}