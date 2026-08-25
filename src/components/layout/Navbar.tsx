'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
              Home
            </Link>
            <Link
              href="/about"
              className={`transition flex items-center gap-1 ${isActive('/about') ? 'text-accent' : 'text-primary hover:text-accent'}`}
            >
              About Us
            </Link>
            <Link
              href="/live-class"
              className={`transition flex items-center gap-1 ${isActive('/live-class') ? 'text-accent' : 'text-primary hover:text-accent'}`}
            >
              1:1 Session
            </Link>
            <Link
              href="/mentors"
              className={`transition flex items-center gap-1 ${isActive('/mentors') ? 'text-accent' : 'text-primary hover:text-accent'}`}
            >
              Meet your Tutor
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
            {session ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 bg-secondary/10 text-primary hover:bg-secondary/20 transition rounded-full font-bold text-sm border border-secondary/20"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-playfair font-black text-sm relative overflow-hidden">
                    {session.user.image ? (
                      <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                    ) : (
                      session.user.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="hidden sm:block">{session.user.name || 'User'}</span>
                  <ChevronDown size={16} className={`transition-transform text-primary/50 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-secondary/20 overflow-hidden flex flex-col py-2 animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-secondary/20 mb-2">
                      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-xs font-bold text-primary truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href={session.user.role === 'STUDENT' ? '/student' : '/tutor'}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 text-primary transition font-bold text-sm"
                    >
                      <LayoutDashboard size={16} className="text-accent" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setIsDropdownOpen(false); signOut({ callbackUrl: '/' }); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition font-bold text-sm w-full text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/become-tutor"
                  className={`hidden lg:block text-sm font-semibold transition ${isActive('/become-tutor') ? 'text-accent' : 'text-primary hover:text-accent'}`}
                >
                  Become a Tutor
                </Link>
                <Link
                  href="/login"
                  className="hidden md:block px-6 py-2.5 bg-accent text-white font-medium text-sm rounded-md shadow-sm hover:bg-primary transition-colors duration-300"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-primary hover:bg-secondary/10 rounded-md transition-colors ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-secondary/20 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-base font-bold ${isActive('/') ? 'text-accent' : 'text-primary'}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-base font-bold ${isActive('/about') ? 'text-accent' : 'text-primary'}`}
            >
              About Us
            </Link>
            <Link
              href="/live-class"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-base font-bold ${isActive('/live-class') ? 'text-accent' : 'text-primary'}`}
            >
              1:1 Session
            </Link>
            <Link
              href="/mentors"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-base font-bold ${isActive('/mentors') ? 'text-accent' : 'text-primary'}`}
            >
              Meet your Tutor
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 text-base font-bold ${isActive('/pricing') ? 'text-accent' : 'text-primary'}`}
            >
              Subscription
            </Link>
            {!session ? (
              <div className="border-t border-secondary/20 pt-4 mt-2">
                <Link
                  href="/become-tutor"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-base font-bold text-primary mb-2"
                >
                  Become a Tutor
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-accent text-white font-medium text-sm rounded-md shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="border-t border-secondary/20 pt-4 mt-2">
                <div className="px-2 mb-4">
                  <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-primary truncate">{session.user.name}</p>
                  <p className="text-xs text-primary/70 truncate">{session.user.email}</p>
                </div>
                <Link
                  href={session.user.role === 'STUDENT' ? '/student' : '/tutor'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-base font-bold text-primary mb-2"
                >
                  <LayoutDashboard size={18} className="text-accent" />
                  Dashboard
                </Link>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="flex items-center gap-3 py-3 text-base font-bold text-red-600 w-full text-left"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}