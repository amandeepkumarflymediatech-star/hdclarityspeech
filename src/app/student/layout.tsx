import Link from "next/link";
import { LayoutDashboard, Calendar, CreditCard, Settings } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-green-900 text-white flex flex-col shadow-xl">
        <div className="p-6 font-bold text-xl border-b border-green-800">Student Portal</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/student" className="flex items-center gap-3 p-3 rounded hover:bg-green-800 transition"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link href="/student/appointments" className="flex items-center gap-3 p-3 rounded hover:bg-green-800 transition"><Calendar size={20} /> My Sessions</Link>
          <Link href="/student/subscriptions" className="flex items-center gap-3 p-3 rounded hover:bg-green-800 transition"><CreditCard size={20} /> Subscription</Link>
          <Link href="/student/settings" className="flex items-center gap-3 p-3 rounded hover:bg-green-800 transition"><Settings size={20} /> Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}