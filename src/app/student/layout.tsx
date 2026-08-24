'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CreditCard, Settings, LogOut, Bell, Search, Award, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import logoImg from "@/../public/logo.png";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navItems = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'My Sessions', href: '/student/appointments', icon: Calendar },
    { name: 'Subscription', href: '/student/subscriptions', icon: CreditCard },
    { name: 'Settings', href: '/student/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen print:h-auto bg-secondary/10 print:bg-white overflow-hidden print:overflow-visible font-sans print:block">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`print:hidden fixed inset-y-0 left-0 w-72 bg-white flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0 border-r border-secondary/30 shadow-2xl md:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between border-b border-secondary/30">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-8" priority />
            <span className="font-bold text-xl text-primary tracking-tight">Student<span className="text-accent">Portal</span></span>
          </Link>
          <button className="md:hidden text-primary/50 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 py-8 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-6 ml-4">Overview</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 transition-all duration-300 rounded-2xl group ${
                    isActive 
                      ? 'bg-accent/10 text-accent font-black shadow-sm' 
                      : 'text-primary/60 hover:bg-secondary/20 hover:text-primary'
                  }`}
                >
                  <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'text-accent' : 'group-hover:text-accent group-hover:scale-110'}`} /> 
                  <span className="font-bold text-sm tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Progress Widget in Sidebar */}
        <div className="px-6 mb-8">
          <div className="bg-secondary/10 rounded-3xl p-5 border border-secondary/30 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3 text-accent mb-3">
              <div className="p-1.5 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform">
                <Award size={16} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Level 3</span>
            </div>
            <p className="text-sm font-bold text-primary mb-3">Articulation Master</p>
            <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
              <div className="bg-accent h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]"></div>
            </div>
            <p className="text-[10px] text-primary/50 mt-3 text-right uppercase tracking-widest font-bold">65% to Level 4</p>
          </div>
        </div>

        <div className="p-6 border-t border-secondary/30">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-4 px-4 py-3.5 text-primary/60 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-2xl group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-bold text-sm tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full print:h-auto overflow-hidden print:overflow-visible relative print:block">
        {/* Top Navbar */}
        <header className="print:hidden h-24 bg-secondary/10 backdrop-blur-md flex items-center justify-between px-6 md:px-10 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary p-2 bg-white rounded-xl shadow-sm border border-secondary/30 hover:bg-secondary/10 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block w-64 md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white border border-secondary/30 pl-12 pr-4 py-3 text-sm focus:border-accent text-primary outline-none transition-all placeholder-primary/40 rounded-2xl shadow-sm hover:shadow-md focus:shadow-md"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-white border border-secondary/30 rounded-xl text-primary/60 hover:text-primary hover:shadow-md transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full shadow-[0_0_5px_rgba(var(--accent),0.5)]"></span>
            </button>
            <div className="h-8 w-px bg-secondary/30 hidden sm:block"></div>
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="hidden sm:block text-right transition-transform group-hover:-translate-x-1">
                <div className="text-sm font-bold text-primary leading-tight">{session?.user?.name || 'Student'}</div>
                <div className="text-[10px] text-accent uppercase tracking-widest mt-1 font-bold">Student</div>
              </div>
              <div className="w-12 h-12 bg-primary flex items-center justify-center text-white font-black font-playfair text-xl rounded-2xl shadow-lg border border-primary/20 group-hover:scale-105 transition-transform uppercase">
                {session?.user?.name ? session.user.name.charAt(0) : 'S'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto print:overflow-visible p-6 md:p-10 print:p-0 bg-transparent">
          <div className="max-w-7xl mx-auto pb-20 print:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}