'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Video, Settings, LogOut, Bell, Search, Menu, X, CircleDollarSign, Users, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import logoImg from "@/../public/logo.png";

export default function DashboardLayout({ children, user }: { children: React.ReactNode, user: any }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/tutor', icon: LayoutDashboard },
    { name: 'Appointments', href: '/tutor/appointments', icon: Calendar },
    { name: 'Earnings', href: '/tutor/earnings', icon: CircleDollarSign },
    { name: 'My Students', href: '/tutor/students', icon: Users },
    { name: 'All Tutors', href: '/tutor/allTutors', icon: Users },
    { name: 'Profile', href: '/tutor/profile', icon: User },
    { name: 'Settings', href: '/tutor/settings', icon: Settings },
  ];

  const displayName = user?.name || 'Tutor';
  const displayHeadline = user?.teachingHeadline || 'Speech Therapist';

  return (
    <div className="flex h-screen bg-secondary/20 overflow-hidden font-sans selection:bg-accent/20">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0 border-r border-secondary/30 shadow-xl md:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-secondary/20">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-8" priority />
            <span className="font-bold text-xl text-primary tracking-tight">Tutor<span className="text-accent">Portal</span></span>
          </Link>
          <button className="md:hidden text-primary/60 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 py-8 flex-1 overflow-y-auto">
          <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-6">Overview</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = item.href === '/tutor' 
                ? pathname === '/tutor' 
                : (pathname === item.href || pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'text-primary/70 hover:bg-secondary/40 hover:text-primary'
                  }`}
                >
                  <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'text-accent' : 'group-hover:text-accent group-hover:scale-110'}`} /> 
                  <span className="font-bold text-sm tracking-widest uppercase">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-secondary/20">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-4 px-4 py-3.5 rounded-2xl text-primary/70 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform text-red-400 group-hover:text-red-600" /> 
            <span className="font-bold text-sm uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-secondary/30 flex items-center justify-between px-6 md:px-10 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary/70 p-2 hover:bg-secondary/30 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block w-64 md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-secondary/10 border border-secondary/40 pl-12 pr-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all placeholder-primary/40 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-primary/60 hover:text-primary transition-colors hover:bg-secondary/30 rounded-full">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <div className="h-10 w-px bg-secondary/50 hidden sm:block"></div>
            <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-11 h-11 bg-primary flex items-center justify-center text-white font-black font-playfair text-xl rounded-2xl shadow-sm shadow-primary/20 relative overflow-hidden">
                {user?.image ? (
                  <Image src={user.image} alt="Profile" fill className="object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-primary leading-tight font-sans">{displayName}</div>
                <div className="text-[10px] text-accent uppercase tracking-widest mt-0.5 font-bold truncate max-w-[150px]">{displayHeadline}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
