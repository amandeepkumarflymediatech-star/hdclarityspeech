'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Bell, Search, GraduationCap, MessageSquare, FileText, SearchCode, BookOpen, Banknote, Tag } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import logoImg from "@/../public/logo.png";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Enrollments', href: '/admin/enrollments', icon: BookOpen },
    { name: 'Payments', href: '/admin/payments', icon: Banknote },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Packages', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Tutors', href: '/admin/tutors', icon: GraduationCap },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'SEO', href: '/admin/seo', icon: SearchCode },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-primary">
      <Toaster position="top-right" richColors />
      {/* Sidebar */}
      <aside className="w-72 bg-primary flex flex-col shadow-2xl relative z-20 hidden md:flex border-r border-accent/20">
        <div className="p-6 flex items-center gap-3 border-b border-accent/20">
          <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-8 brightness-200" priority />
          <span className="font-bold text-xl text-white tracking-tight">Admin<span className="text-accent">Portal</span></span>
        </div>

        <div className="px-4 py-6">
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 px-3">Overview</p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group ${isActive
                      ? 'bg-accent text-white shadow-[0_0_15px_-3px_rgba(175,11,44,0.4)]'
                      : 'text-secondary/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-bold text-sm tracking-wide uppercase">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-accent/20">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-sm text-secondary hover:bg-accent/20 hover:text-accent transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-secondary/50 flex items-center justify-end px-8 z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-primary/60 hover:text-accent transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-secondary/50"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold font-playfair text-xl shadow-md">
                A
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-primary leading-tight font-sans">Admin User</div>
                <div className="text-xs text-primary/60 uppercase tracking-widest mt-0.5">Superadmin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/30">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}