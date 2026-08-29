import React from 'react';
import { prisma } from '@/lib/db';
import { BookOpen, Calendar, Clock, User, CheckCircle2, Video } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Pagination from '@/components/admin/Pagination';
import EnrollmentsFilter from './_components/EnrollmentsFilter';

export const dynamic = 'force-dynamic';

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'ACTIVE':
    case 'COMPLETED': return 'bg-green-100 text-green-700';
    case 'PAID':
    case 'SCHEDULED': return 'bg-blue-100 text-blue-700';
    case 'CANCELLED':
    case 'FAILED':
    case 'MISSED': return 'bg-red-100 text-red-700';
    case 'PENDING': return 'bg-orange-100 text-orange-700';
    case 'RESCHEDULED': return 'bg-purple-100 text-purple-700';
    case 'DEPLETED': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default async function AdminEnrollmentsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const tab = params.tab === 'bookings' ? 'bookings' : (params.tab === 'sessions' ? 'sessions' : 'packages');
  const page = Number(params.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const q = params.q as string || '';
  const statusFilter = params.status as string || 'ALL';
  const sortOption = params.sort as string || 'newest';

  // Build sorting object
  const getOrderBy = (dateField: string): any => {
    switch (sortOption) {
      case 'oldest': return { [dateField]: 'asc' };
      case 'status-asc': return [{ status: 'asc' }, { [dateField]: 'desc' }];
      case 'status-desc': return [{ status: 'desc' }, { [dateField]: 'desc' }];
      case 'newest':
      default: return { [dateField]: 'desc' };
    }
  };

  // Fetch aggregates for stats cards
  const [activePackagesCount, activeBookingsCount, scheduledSessionsCount] = await Promise.all([
    prisma.studentPackage.count({ where: { status: 'ACTIVE' } }),
    prisma.booking.count({ where: { status: { in: ['PAID', 'SCHEDULED'] } } }),
    prisma.session.count({ where: { status: 'SCHEDULED' } })
  ]);

  let packages: any[] = [];
  let bookings: any[] = [];
  let sessions: any[] = [];
  let totalItems = 0;

  if (tab === 'packages') {
    const whereClause: any = {};
    if (statusFilter !== 'ALL') whereClause.status = statusFilter;
    if (q) {
      whereClause.student = {
        OR: [{ name: { contains: q } }, { email: { contains: q } }]
      };
    }

    const [fetchedPackages, count] = await Promise.all([
      prisma.studentPackage.findMany({
        where: whereClause,
        include: {
          student: { select: { name: true, email: true } },
          package: { select: { name: true } },
        },
        orderBy: getOrderBy('createdAt'),
        skip,
        take: pageSize,
      }),
      prisma.studentPackage.count({ where: whereClause })
    ]);
    packages = fetchedPackages;
    totalItems = count;
  } else if (tab === 'bookings') {
    const whereClause: any = {};
    if (statusFilter !== 'ALL') whereClause.status = statusFilter;
    if (q) {
      whereClause.OR = [
        { student: { name: { contains: q } } },
        { student: { email: { contains: q } } },
        { tutor: { name: { contains: q } } },
        { tutor: { email: { contains: q } } }
      ];
    }

    const [fetchedBookings, count] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
        include: {
          student: { select: { name: true, email: true } },
          tutor: { select: { name: true, email: true } },
          sessionType: { select: { name: true } },
          sessions: true,
        },
        orderBy: getOrderBy('createdAt'),
        skip,
        take: pageSize,
      }),
      prisma.booking.count({ where: whereClause })
    ]);
    bookings = fetchedBookings;
    totalItems = count;
  } else if (tab === 'sessions') {
    const whereClause: any = {};
    if (statusFilter !== 'ALL') whereClause.status = statusFilter;
    if (q) {
      whereClause.OR = [
        { student: { name: { contains: q } } },
        { student: { email: { contains: q } } },
        { tutor: { name: { contains: q } } },
        { tutor: { email: { contains: q } } }
      ];
    }

    const [fetchedSessions, count] = await Promise.all([
      prisma.session.findMany({
        where: whereClause,
        include: {
          student: { select: { name: true, email: true } },
          tutor: { select: { name: true, email: true } },
          booking: { include: { sessionType: { select: { name: true } } } }
        },
        orderBy: getOrderBy('scheduledAt'),
        skip,
        take: pageSize,
      }),
      prisma.session.count({ where: whereClause })
    ]);
    sessions = fetchedSessions;
    totalItems = count;
  }

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-primary font-playfair mb-2">Student Enrollments</h1>
        <p className="text-primary/60 text-sm">Monitor active student packages, bookings, and individual sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border-l-4 border-accent shadow-sm rounded-r-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Active Packages</p>
            <h3 className="text-3xl font-black text-primary">{activePackagesCount}</h3>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
        </div>
        
        <div className="bg-white p-6 border-l-4 border-[#006BFF] shadow-sm rounded-r-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Active Bookings</p>
            <h3 className="text-3xl font-black text-primary">{activeBookingsCount}</h3>
          </div>
          <div className="w-12 h-12 bg-[#006BFF]/10 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#006BFF]" />
          </div>
        </div>

        <div className="bg-white p-6 border-l-4 border-purple-500 shadow-sm rounded-r-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Scheduled Sessions</p>
            <h3 className="text-3xl font-black text-primary">{scheduledSessionsCount}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <Link
            href="?tab=packages&page=1"
            className={`${
              tab === 'packages'
                ? 'border-accent text-accent'
                : 'border-transparent text-primary/60 hover:border-secondary hover:text-primary'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold uppercase tracking-widest transition-colors`}
          >
            Package Enrollments
          </Link>
          <Link
            href="?tab=bookings&page=1"
            className={`${
              tab === 'bookings'
                ? 'border-accent text-accent'
                : 'border-transparent text-primary/60 hover:border-secondary hover:text-primary'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold uppercase tracking-widest transition-colors`}
          >
            Individual Bookings
          </Link>
          <Link
            href="?tab=sessions&page=1"
            className={`${
              tab === 'sessions'
                ? 'border-accent text-accent'
                : 'border-transparent text-primary/60 hover:border-secondary hover:text-primary'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold uppercase tracking-widest transition-colors`}
          >
            All Sessions
          </Link>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary overflow-hidden mt-4">
        <div className="px-6 py-4 border-b border-secondary bg-secondary/20">
          <h2 className="font-bold text-primary mb-4">{tab === 'packages' ? 'Package Enrollments' : tab === 'bookings' ? 'Individual Bookings' : 'All Sessions'}</h2>
          <EnrollmentsFilter currentTab={tab} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {tab === 'packages' ? (
                <tr className="bg-secondary/10">
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Student</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Package</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Sessions</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Expires</th>
                </tr>
              ) : tab === 'bookings' ? (
                <tr className="bg-secondary/10">
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Student</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Tutor</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Session Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Date</th>
                </tr>
              ) : (
                <tr className="bg-secondary/10">
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Student</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Tutor</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Session Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Time</th>
                </tr>
              )}
            </thead>
            <tbody className="text-sm">
              {tab === 'packages' && packages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-primary/40 font-bold italic">No packages found.</td>
                </tr>
              )}
              {tab === 'bookings' && bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-primary/40 font-bold italic">No bookings found.</td>
                </tr>
              )}
              {tab === 'sessions' && sessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-primary/40 font-bold italic">No sessions found.</td>
                </tr>
              )}
              
              {tab === 'packages' && packages.map((pkg) => (
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
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusStyle(pkg.status)}`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/70">{format(new Date(pkg.expiresAt), 'MMM d, yyyy')}</td>
                </tr>
              ))}

              {tab === 'bookings' && bookings.map((booking) => (
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
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/70">{format(new Date(booking.createdAt), 'MMM d, yyyy')}</td>
                </tr>
              ))}

              {tab === 'sessions' && sessions.map((session) => (
                <tr key={session.id} className="border-b border-secondary/50 hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">
                    {session.student.name}
                    <span className="block text-xs font-normal text-primary/50">{session.student.email}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">
                    {session.tutor.name}
                    <span className="block text-xs font-normal text-primary/50">{session.tutor.email}</span>
                  </td>
                  <td className="px-6 py-4 font-bold">{session.booking?.sessionType?.name || 'Session'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusStyle(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/70">{format(new Date(session.scheduledAt), 'MMM d, yyyy h:mm a')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
