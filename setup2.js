const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/api/auth/login',
  'src/app/api/auth/register',
  'src/app/api/admin/users',
  'src/app/api/admin/subscriptions',
  'src/app/api/tutor/schedule',
  'src/app/api/tutor/appointments',
  'src/app/api/student/subscriptions',
  'src/app/api/student/appointments',
  'src/app/api/webhooks/calendly',
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const routeContent = 'import { NextResponse } from "next/server";\n\nexport async function GET() {\n  return NextResponse.json({ message: "Not implemented yet" });\n}\n\nexport async function POST(req: Request) {\n  return NextResponse.json({ message: "Not implemented yet" });\n}';

dirs.forEach(d => {
  fs.writeFileSync(path.join(__dirname, d, 'route.ts'), routeContent);
});

// Update the layouts for the dashboards
const adminLayout = `import Link from "next/link";
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
}`;

const tutorLayout = `import Link from "next/link";
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
}`;

const studentLayout = `import Link from "next/link";
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
}`;

fs.writeFileSync(path.join(__dirname, 'src/app/admin/layout.tsx'), adminLayout);
fs.writeFileSync(path.join(__dirname, 'src/app/tutor/layout.tsx'), tutorLayout);
fs.writeFileSync(path.join(__dirname, 'src/app/student/layout.tsx'), studentLayout);

console.log('API structure and Layouts setup complete!');
