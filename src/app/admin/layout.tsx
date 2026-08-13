import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 font-bold text-xl border-b border-slate-800">Admin Portal</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition"><Users size={20} /> Users</Link>
          <Link href="/admin/subscriptions" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition"><CreditCard size={20} /> Subscriptions</Link>
          <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition"><Settings size={20} /> Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}