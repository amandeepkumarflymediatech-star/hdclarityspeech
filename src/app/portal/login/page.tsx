'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck, ChevronLeft } from 'lucide-react';
import gsap from 'gsap';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function AdminLoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState(urlError || '');
  
  const router = useRouter();
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (urlError) {
      toast.error(urlError);
    }
  }, [urlError]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    ).fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
      "-=0.5"
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
        role: 'ADMIN',
        redirect: false,
      });

      if (res?.error) {
        setStatus('error');
        setErrorMessage(res.error);
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();

        if (session?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          setStatus('error');
          setErrorMessage('Access denied. Admin privileges required.');
        }
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Authentication failed.');
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0A] font-sans selection:bg-accent selection:text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-accent/40 to-purple-600/40 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-blue-600/30 to-accent/30 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div ref={cardRef} className="w-full max-w-[440px] relative z-10 perspective-1000">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 sm:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[2.5rem] relative overflow-hidden group hover:border-white/20 transition-all duration-700 ease-out">
          
          {/* Shine effect */}
          <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none"></div>

          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/20 border border-white/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2 font-playfair tracking-tight">Admin<br/>Portal.</h1>
            </div>
            <Link href="/" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group/back">
              <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-20">
            <div>
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Admin Email</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                  <Mail className="h-5 w-5 text-white/30 group-focus-within/input:text-accent transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 text-white focus:ring-0 focus:border-accent transition-all duration-300 outline-none placeholder-white/20 rounded-2xl text-sm"
                  placeholder="admin@hdclarity.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                  <Lock className="h-5 w-5 text-white/30 group-focus-within/input:text-accent transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-black/20 border border-white/10 text-white focus:ring-0 focus:border-accent transition-all duration-300 outline-none placeholder-white/20 rounded-2xl text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {status === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl text-center backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-between px-6 py-4 bg-white text-[#0A0A0A] hover:bg-accent hover:text-white font-black transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_30px_-15px_rgba(var(--color-accent),0.5)] group disabled:opacity-50 mt-10 uppercase tracking-widest text-xs rounded-2xl overflow-hidden relative"
            >
              <span className="relative z-10">{status === 'loading' ? 'Authenticating...' : 'Authenticate'}</span>
              <div className="w-8 h-8 rounded-full bg-[#0A0A0A]/5 group-hover:bg-white/20 flex items-center justify-center transition-colors relative z-10">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </form>
          
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        
        {/* Helper footer */}
        <div className="mt-8 flex justify-center items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-black">
          <ShieldCheck className="w-3 h-3" />
          <span>HD Clarity Secure Gateway</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white tracking-widest text-xs uppercase font-bold animate-pulse">Establishing Secure Connection...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
