import React from 'react';
import { prisma } from '@/lib/db';
import { BookOpen, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminEnrollmentsPage() {
  // Fetch Student Packages
  const packages = await prisma.studentPackage.findMany({
    include: {
      student: {
        select: { name: true, email: true },
      },
      package: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch individual bookings that are paid or completed
  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        in: ['PAID', 'SCHEDULED', 'COMPLETED'],
      },
    },
    include: {
      student: { select: { name: true, email: true } },
      tutor: { select: { name: true, email: true } },
      sessionType: { select: { name: true } },
      sessions: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-primary font-playfair mb-2">Student Enrollments</h1>
        <p className="text-primary/60 text-sm">Monitor active student packages and individual session bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border-l-4 border-accent shadow-sm rounded-r-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Total Active Packages</p>
            <h3 className="text-3xl font-black text-primary">{packages.filter(p => p.status === 'ACTIVE').length}</h3>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
        </div>
        
        <div className="bg-white p-6 border-l-4 border-[#006BFF] shadow-sm rounded-r-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Total Active Bookings</p>
            <h3 className="text-3xl font-black text-primary">{bookings.length}</h3>
          </div>
          <div className="w-12 h-12 bg-[#006BFF]/10 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#006BFF]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary bg-secondary/20">
          <h2 className="font-bold text-primary">Package Enrollments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10">
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Package</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Sessions</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Expires</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-primary/40 font-bold italic">No packages found.</td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-secondary/50 hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary">
                      {pkg.student.name}
                      <span className="block text-xs font-normal text-primary/50">{pkg.student.email}</span>
                    </td>
                    <td className="px-6 py-4 font-bold">{pkg.package.name}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary">{pkg.remainingSessions}</span> / {pkg.totalSessions} left
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        pkg.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        pkg.status === 'DEPLETED' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary/70">{format(new Date(pkg.expiresAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-secondary bg-secondary/20">
          <h2 className="font-bold text-primary">Individual Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10">
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Tutor</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Session Type</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-primary/40 font-bold italic">No active bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-secondary/50 hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary">
                      {booking.student.name}
                      <span className="block text-xs font-normal text-primary/50">{booking.student.email}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {booking.tutor.name}
                      <span className="block text-xs font-normal text-primary/50">{booking.tutor.email}</span>
                    </td>
                    <td className="px-6 py-4 font-bold">{booking.sessionType.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary/70">{format(new Date(booking.createdAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
