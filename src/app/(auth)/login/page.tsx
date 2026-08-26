import Link from 'next/link';
import { User, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';

export default function LoginSelectionPage() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-none shadow-xl overflow-hidden flex flex-col border border-secondary p-8 sm:p-12 md:p-16">
        
        <Link href="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs tracking-widest uppercase mb-12 transition-colors self-start">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl font-black text-primary mb-4 font-playfair tracking-tight">
            Welcome Back
          </h1>
          <p className="text-primary/70 font-sans text-lg max-w-lg mx-auto">
            How do you want to use the platform today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          
          <Link href="/student/login" className="group relative bg-white border-2 border-secondary hover:border-accent p-8 sm:p-10 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-secondary group-hover:bg-accent/10 rounded-full flex items-center justify-center mb-6 transition-colors">
              <User className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-primary font-playfair mb-3">I am a Student</h2>
            <p className="text-primary/70 text-sm font-sans mb-8">Access your learning dashboard, view upcoming sessions, and track progress.</p>
            <div className="mt-auto flex items-center gap-2 text-accent font-bold text-sm tracking-widest uppercase">
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/tutor/login" className="group relative bg-white border-2 border-secondary hover:border-accent p-8 sm:p-10 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-secondary group-hover:bg-accent/10 rounded-full flex items-center justify-center mb-6 transition-colors">
              <BookOpen className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-primary font-playfair mb-3">I am a Tutor</h2>
            <p className="text-primary/70 text-sm font-sans mb-8">Manage your students, update your schedule, and view earnings.</p>
            <div className="mt-auto flex items-center gap-2 text-accent font-bold text-sm tracking-widest uppercase">
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        <div className="mt-16 text-center text-primary/70 font-sans text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-accent font-bold hover:text-primary transition-colors">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}