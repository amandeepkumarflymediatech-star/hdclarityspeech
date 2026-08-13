'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from "@/../public/logo.png";
import { ArrowRight, Mail } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8 transition-colors duration-300 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800">
        
        <div className="mb-10 text-center">
          <Link href="/" className="mb-8 inline-block">
            <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-16 rounded-lg dark:brightness-200 mx-auto" priority />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Forgot Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 p-6 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-center">
            <p className="font-semibold mb-2">Check your email!</p>
            <p className="text-sm">{message}</p>
            <Link href="/login" className="inline-block mt-6 text-emerald-700 dark:text-emerald-300 font-semibold hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors disabled:opacity-50"
            >
              <span>{status === 'loading' ? 'Sending...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-slate-500 text-sm">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
