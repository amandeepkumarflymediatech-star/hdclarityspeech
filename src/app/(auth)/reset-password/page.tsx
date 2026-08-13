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
        <h2 className="text-xl font-bold text-red-500 mb-2">Invalid Link</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">This password reset link is missing its secure token.</p>
        <Link href="/forgot-password" className="text-blue-600 font-semibold hover:underline">Request a new link</Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Password Reset!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <p className="text-sm text-slate-400">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="••••••••"
            required
            minLength={6}
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
        <span>{status === 'loading' ? 'Resetting...' : 'Reset Password'}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8 transition-colors duration-300 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800">
        
        <div className="mb-10 text-center">
          <Link href="/" className="mb-8 inline-block">
            <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-16 rounded-lg dark:brightness-200 mx-auto" priority />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Create New Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Please enter your new password below.
          </p>
        </div>

        <Suspense fallback={<div className="text-center p-4 text-slate-500">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>

      </div>
    </div>
  );
}
