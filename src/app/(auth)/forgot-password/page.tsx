'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from "@/../public/logo.png";
import { ArrowRight, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 sm:p-8 transition-colors duration-300 font-sans">
      <div className="max-w-md w-full bg-white rounded-none shadow-xl p-8 sm:p-12 border border-secondary relative">
        <Link href="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs tracking-widest uppercase mb-8 transition-colors self-start">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="mb-10 text-center">
          <Link href="/" className="mb-8 inline-block">
            <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-16 mx-auto" priority />
          </Link>
          <h1 className="text-3xl font-black text-primary mb-3 tracking-tight font-playfair">
            Forgot Password
          </h1>
          <p className="text-primary/70 font-sans">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-secondary/30 text-primary p-8 border border-secondary text-center">
            <p className="font-bold text-lg mb-2 font-playfair">Check your email!</p>
            <p className="text-sm font-sans">{message}</p>
            <Link href="/login" className="inline-block mt-8 text-accent font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {status === 'error' && (
              <p className="text-accent text-sm font-bold bg-accent/10 p-3">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-primary text-white font-bold py-5 px-8 transition-colors duration-200 group disabled:opacity-70 mt-8 uppercase tracking-widest text-sm rounded-none shadow-sm"
            >
              <span>{status === 'loading' ? 'Sending...' : 'Send Reset Link'}</span>
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
    </div>
  );
}
