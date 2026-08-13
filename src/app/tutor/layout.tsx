import Link from "next/link";
import { LayoutDashboard, Calendar, Video, Settings } from "lucide-react";

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-xl">
        <div className="p-6 font-bold text-xl border-b border-blue-800">Tutor Portal</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/tutor" className="flex items-center gap-3 p-3 rounded hover:bg-blue-800 transition"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link href="/tutor/appointments" className="flex items-center gap-3 p-3 rounded hover:bg-blue-800 transition"><Calendar size={20} /> Appointments</Link>
          <Link href="/tutor/live" className="flex items-center gap-3 p-3 rounded hover:bg-blue-800 transition"><Video size={20} /> Live Room</Link>
          <Link href="/tutor/settings" className="flex items-center gap-3 p-3 rounded hover:bg-blue-800 transition"><Settings size={20} /> Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}