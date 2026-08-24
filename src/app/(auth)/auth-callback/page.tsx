'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const processAuth = async () => {
      try {
        const intendedRole = localStorage.getItem('intended_role');
        
        if (intendedRole === 'TUTOR' && session?.user?.role !== 'TUTOR') {
          // Upgrade user to Tutor
          const res = await fetch('/api/user/role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'TUTOR' })
          });
          
          if (res.ok) {
            localStorage.removeItem('intended_role');
            // Force session update so the client knows they are a tutor
            await update();
            router.push('/tutor/onboarding');
            return;
          } else {
            console.error('Failed to update role');
            setError(true);
            return;
          }
        }
        
        // Default routing based on role
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else if (session?.user?.role === 'TUTOR') {
          if (session?.user?.isApproved) {
            router.push('/tutor');
          } else {
            router.push('/tutor/onboarding');
          }
        } else {
          router.push('/student');
        }
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    processAuth();
  }, [status, session, router, update]);

  if (error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center font-sans">
        <div className="bg-white p-8 border border-secondary text-center shadow-lg">
          <p className="text-red-500 font-bold mb-4 text-xl font-playfair">Something went wrong during setup.</p>
          <button 
            onClick={() => router.push('/login')} 
            className="text-xs uppercase tracking-widest font-bold text-primary hover:text-accent"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center font-sans gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-bold tracking-widest uppercase text-xs animate-pulse">Setting up your account...</p>
    </div>
  );
}
