'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CreditCard, Settings, LogOut, Bell, Search, Award, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import logoImg from "@/../public/logo.png";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'My Sessions', href: '/student/appointments', icon: Calendar },
    { name: 'Subscription', href: '/student/subscriptions', icon: CreditCard },
    { name: 'Settings', href: '/student/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-secondary overflow-hidden font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0 border-r border-secondary shadow-xl md:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-secondary bg-white">
          <div className="flex items-center gap-3">
            <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-8" priority />
            <span className="font-bold text-xl text-primary tracking-tight">Student<span className="text-accent">Portal</span></span>
          </div>
          <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 py-8 flex-1 overflow-y-auto">
          <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-6">Overview</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 transition-colors group ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-primary/70 hover:bg-secondary hover:text-primary'
                  }`}
                >
                  <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'text-accent' : 'group-hover:text-accent group-hover:scale-110'}`} /> 
                  <span className="font-bold text-sm tracking-widest uppercase">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Progress Widget in Sidebar */}
        <div className="px-6 mb-6">
          <div className="bg-secondary/30 rounded-none p-5 border border-secondary">
            <div className="flex items-center gap-3 text-accent mb-3">
              <Award size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Level 3</span>
            </div>
            <p className="text-sm font-bold text-primary mb-3 font-sans">Articulation Master</p>
            <div className="w-full bg-white rounded-none h-2 overflow-hidden border border-secondary">
              <div className="bg-accent h-2 rounded-none w-[65%]"></div>
            </div>
            <p className="text-xs text-primary/50 mt-3 text-right uppercase tracking-widest font-bold">65% to Level 4</p>
          </div>
        </div>

        <div className="p-6 border-t border-secondary bg-white">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-4 px-4 py-4 text-primary/70 hover:bg-accent hover:text-white transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-bold text-sm uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-secondary flex items-center justify-between px-6 md:px-10 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary p-2 hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block w-64 md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-secondary/30 border border-secondary pl-12 pr-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors placeholder-primary/40 rounded-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-primary/60 hover:text-primary transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-secondary hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary flex items-center justify-center text-white font-black font-playfair text-xl">
                S
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-primary leading-tight font-sans">Alice Student</div>
                <div className="text-xs text-accent uppercase tracking-widest mt-1 font-bold">Premium Plan</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}