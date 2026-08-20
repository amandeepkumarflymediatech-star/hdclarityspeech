'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Bell, Search } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import logoImg from "@/../public/logo.png";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-navy flex flex-col shadow-2xl relative z-20 hidden md:flex border-r border-brand-crimson/20">
        <div className="p-6 flex items-center gap-3 border-b border-brand-crimson/20">
          <Image src={logoImg} alt="HD Clarity Logo" className="object-contain w-auto h-8 brightness-200" priority />
          <span className="font-bold text-xl text-white tracking-tight">Admin<span className="text-brand-crimson">Portal</span></span>
        </div>

        <div className="px-4 py-6">
          <p className="text-xs font-bold text-brand-bluegrey uppercase tracking-widest mb-4 px-3">Overview</p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group ${isActive
                      ? 'bg-brand-crimson text-white shadow-[0_0_15px_-3px_rgba(175,11,44,0.4)]'
                      : 'text-brand-bluegrey hover:bg-black/20 hover:text-white'
                    }`}
                >
                  <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-bold text-sm tracking-wide uppercase">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-brand-crimson/20">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-sm text-brand-bluegrey hover:bg-brand-crimson/20 hover:text-brand-crimson transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 bg-black/80 backdrop-blur-md border-b border-brand-crimson/20 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-bluegrey" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-brand-navy border-none rounded-none pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-brand-crimson text-white outline-none transition-all placeholder-brand-bluegrey"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-brand-bluegrey hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-crimson rounded-full border-2 border-black"></span>
            </button>
            <div className="h-8 w-px bg-brand-crimson/20"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-brand-crimson flex items-center justify-center text-white font-bold font-playfair text-xl shadow-md">
                A
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-white leading-tight font-sans">Admin User</div>
                <div className="text-xs text-brand-bluegrey uppercase tracking-widest mt-0.5">Superadmin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}