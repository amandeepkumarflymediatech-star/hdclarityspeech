'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import logoImg from "@/../public/logo.png";
import { ArrowRight, Lock } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage("Passwords do not match.");
      return;
    }
    
    setStatus('loading');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (!token) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-black text-accent mb-2 font-playfair tracking-tight">Invalid Link</h2>
        <p className="text-primary/70 mb-8 font-sans">This password reset link is missing its secure token.</p>
        <Link href="/forgot-password" className="text-accent font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors">Request a new link</Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-secondary/30 border border-secondary">
        <div className="w-16 h-16 bg-secondary text-primary border border-primary/20 rounded-none flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-primary mb-2 font-playfair tracking-tight">Password Reset!</h2>
        <p className="text-primary/70 mb-6 font-sans">{message}</p>
        <p className="text-xs text-primary/50 font-bold uppercase tracking-widest">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">New Password</label>
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
            minLength={6}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-primary/50" />
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-8 pr-4 py-3 border-0 border-b-2 border-secondary text-primary bg-transparent focus:ring-0 focus:border-accent transition-colors duration-200 outline-none text-lg placeholder-primary/30"
            placeholder="••••••••"
            required
            minLength={6}
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
        <span>{status === 'loading' ? 'Resetting...' : 'Reset Password'}</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 sm:p-8 transition-colors duration-300 font-sans">
      <div className="max-w-md w-full bg-white rounded-none shadow-xl p-8 sm:p-12 border border-secondary">
        
        <div className="mb-10 text-center">
          <Link href="/" className="mb-8 inline-block">
            <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-16 mx-auto" priority />
          </Link>
          <h1 className="text-3xl font-black text-primary mb-3 tracking-tight font-playfair">
            Create New Password
          </h1>
          <p className="text-primary/70 font-sans">
            Please enter your new password below.
          </p>
        </div>

        <Suspense fallback={<div className="text-center p-4 text-primary/50">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>

      </div>
    </div>
  );
}
