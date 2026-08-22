'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`w-full bg-white transition-all duration-300 ${isScrolled ? 'shadow-sm border-b border-secondary/50 py-3' : 'py-5 border-b border-secondary/20'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Left Side: Logo */}
          <div className="font-bold flex items-center">
            <Link href="/" className="group flex items-center">
              <Image src="/logo.png" alt="HD Clarity Speech" width={48} height={48} className="object-contain" />
            </Link>
          </div>

          {/* Middle: Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link
              href="/"
              className={`transition flex items-center gap-1 ${isActive('/') ? 'text-accent' : 'text-primary hover:text-accent'}`}
            >
              Home <ChevronDown className="w-4 h-4 opacity-50" />
            </Link>
            <Link
              href="/about"
              className={`transition flex items-center gap-1 ${isActive('/about') ? 'text-accent' : 'text-primary hover:text-accent'}`}
            >
              About Us <ChevronDown className="w-4 h-4 opacity-50" />
            </Link>
            <Link
              href="/live-class"
              className={`transition flex items-center gap-1 ${isActive('/live-class') ? 'text-accent' : 'text-primary hover:text-accent'}`}
            >
              1:1 Session <ChevronDown className="w-4 h-4 opacity-50" />
            </Link>
            <Link
              href="/pricing"
              className={`transition ${isActive('/pricing') ? 'text-accent' : 'text-primary hover:text-accent'}`}
            >
              Subscription
            </Link>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-5">
            <Link
              href="/become-tutor"
              className={`hidden lg:block text-sm font-semibold transition ${isActive('/become-tutor') ? 'text-accent' : 'text-primary hover:text-accent'}`}
            >
              Become a Tutor
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-accent text-white font-medium text-sm rounded-md shadow-sm hover:bg-primary transition-colors duration-300"
            >
              Get Started
            </Link>
          </div>

        </div>
      </nav>
    </div>
  );
}