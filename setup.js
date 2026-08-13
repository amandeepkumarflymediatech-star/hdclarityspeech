const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/(public)/about',
  'src/app/(public)/live-class',
  'src/app/(public)/pricing',
  'src/app/(public)/contact',
  'src/app/(auth)/login',
  'src/app/(auth)/signup',
  'src/app/admin',
  'src/app/tutor',
  'src/app/student',
  'src/app/api',
  'src/components/ui',
  'src/components/animations',
  'src/components/layout',
  'src/lib',
  'src/hooks',
  'prisma'
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const files = {
  'src/app/(public)/page.tsx': 'export default function Home() { return <main className="min-h-screen p-8"><h1>Home</h1></main>; }',
  'src/app/(public)/about/page.tsx': 'export default function About() { return <main className="min-h-screen p-8"><h1>About Us</h1></main>; }',
  'src/app/(public)/live-class/page.tsx': 'export default function LiveClass() { return <main className="min-h-screen p-8"><h1>1:1 Session</h1></main>; }',
  'src/app/(public)/pricing/page.tsx': 'export default function Pricing() { return <main className="min-h-screen p-8"><h1>Subscription</h1></main>; }',
  'src/app/(public)/contact/page.tsx': 'export default function Contact() { return <main className="min-h-screen p-8"><h1>Contact Us</h1></main>; }',
  'src/app/(auth)/login/page.tsx': 'export default function Login() { return <main className="min-h-screen p-8"><h1>Login</h1></main>; }',
  'src/app/(auth)/signup/page.tsx': 'export default function Signup() { return <main className="min-h-screen p-8"><h1>Signup</h1></main>; }',
  'src/app/admin/page.tsx': 'export default function AdminDashboard() { return <main className="min-h-screen p-8"><h1>Admin Dashboard</h1></main>; }',
  'src/app/admin/layout.tsx': 'export default function AdminLayout({ children }: { children: React.ReactNode }) { return <div className="admin-layout flex"><aside className="w-64 min-h-screen bg-gray-900 text-white p-4">Admin Sidebar</aside><main className="flex-1">{children}</main></div>; }',
  'src/app/tutor/page.tsx': 'export default function TutorDashboard() { return <main className="min-h-screen p-8"><h1>Tutor Dashboard</h1></main>; }',
  'src/app/tutor/layout.tsx': 'export default function TutorLayout({ children }: { children: React.ReactNode }) { return <div className="tutor-layout flex"><aside className="w-64 min-h-screen bg-blue-900 text-white p-4">Tutor Sidebar</aside><main className="flex-1">{children}</main></div>; }',
  'src/app/student/page.tsx': 'export default function StudentDashboard() { return <main className="min-h-screen p-8"><h1>Student Dashboard</h1></main>; }',
  'src/app/student/layout.tsx': 'export default function StudentLayout({ children }: { children: React.ReactNode }) { return <div className="student-layout flex"><aside className="w-64 min-h-screen bg-green-900 text-white p-4">Student Sidebar</aside><main className="flex-1">{children}</main></div>; }',
  'src/lib/db.ts': 'import { PrismaClient } from "@prisma/client";\n\nconst globalForPrisma = globalThis as unknown as { prisma: PrismaClient };\n\nexport const prisma = globalForPrisma.prisma || new PrismaClient();\n\nif (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;\n',
  'prisma/schema.prisma': 'generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "mysql"\n  url      = env("DATABASE_URL")\n}\n',
  'src/components/layout/Navbar.tsx': 'import Link from "next/link";\n\nexport default function Navbar() {\n  return (\n    <nav className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">\n      <div className="font-bold text-xl"><Link href="/">HD Clarity</Link></div>\n      <div className="flex gap-6">\n        <Link href="/" className="hover:text-blue-600">Home</Link>\n        <Link href="/about" className="hover:text-blue-600">About Us</Link>\n        <Link href="/live-class" className="hover:text-blue-600">1:1 Session</Link>\n        <Link href="/pricing" className="hover:text-blue-600">Subscription</Link>\n      </div>\n      <div>\n        <Link href="/login" className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">Login</Link>\n      </div>\n    </nav>\n  );\n}',
  'src/components/layout/Footer.tsx': 'export default function Footer() {\n  return (\n    <footer className="bg-gray-50 py-12 text-center border-t border-gray-200 mt-auto">\n      <p className="text-gray-500">© 2026 HD Clarity Speech. All rights reserved.</p>\n    </footer>\n  );\n}'
};

Object.entries(files).forEach(([f, content]) => {
  fs.writeFileSync(path.join(__dirname, f), content);
});
console.log('Structure created!');
