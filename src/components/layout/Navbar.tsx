'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/../public/logo.png";
import { ChevronDown, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check initial theme preference
    if (document.documentElement.classList.contains('dark') || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.add('light');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className={`transition-all duration-500 ease-in-out pointer-events-auto ${isScrolled ? 'pt-4' : 'pt-0'}`}>
        <nav 
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-in-out 
          ${isScrolled 
            ? 'max-w-5xl rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-xl dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 px-6 py-3' 
            : 'w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-slate-800'}`}
        >
          {/* Left Side: Logo */}
          <div className="font-bold flex items-center">
            <Link href="/">
              <Image src={logoImg} alt="HD Clarity Logo" className={`object-contain w-auto transition-all duration-300 ${isScrolled ? 'h-8' : 'h-10'} dark:brightness-200`} priority />
            </Link>
          </div>
          
          {/* Middle: Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-700 dark:text-slate-300">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1">
              Home <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1">
              About Us <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </Link>
            <Link href="/live-class" className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1">
              1:1 Session <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </Link>
            <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white transition">
              Subscription
            </Link>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-5">
            <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium text-sm rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}