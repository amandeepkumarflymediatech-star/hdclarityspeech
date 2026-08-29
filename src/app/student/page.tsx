import { Calendar, Video, Award, Clock, ArrowRight, Target, CheckCircle2, History, CreditCard, Play } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch upcoming sessions
  const upcomingSessionsDB = await prisma.session.findMany({
    where: { studentId: session.user.id, status: { in: ['SCHEDULED', 'UPCOMING'] } },
    include: { tutor: true, booking: { include: { sessionType: true } } },
    orderBy: { scheduledAt: 'asc' },
    take: 3
  });

  // Fetch past sessions
  const pastSessionsDB = await prisma.session.findMany({
    where: { studentId: session.user.id, status: 'COMPLETED' },
    include: { tutor: true, booking: { include: { sessionType: true } } },
    orderBy: { scheduledAt: 'desc' },
    take: 4
  });

  // Fetch active packages/balances
  const activePackages = await prisma.studentPackage.findMany({
    where: { studentId: session.user.id, status: 'ACTIVE' },
    include: { package: true }
  });

  const completedCount = await prisma.session.count({
    where: { studentId: session.user.id, status: 'COMPLETED' }
  });

  const upcomingSessions = upcomingSessionsDB.map(s => ({
    id: s.id,
    tutor: s.tutor.name || 'Expert Tutor',
    time: new Date(s.scheduledAt).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    type: s.booking?.sessionType?.name || 'Speech Therapy',
    duration: s.booking?.sessionType?.durationMinutes ? `${s.booking.sessionType.durationMinutes} min` : '60 min',
    initial: s.tutor.name ? s.tutor.name[0].toUpperCase() : 'T',
    url: s.meetingUrl || '#'
  }));

  const pastSessions = pastSessionsDB.map(s => ({
    id: s.id,
    tutor: s.tutor.name || 'Expert Tutor',
    time: new Date(s.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    type: s.booking?.sessionType?.name || 'Session',
    initial: s.tutor.name ? s.tutor.name[0].toUpperCase() : 'T'
  }));

  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Student Portal
          </h4>
          <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 font-sans text-lg">Welcome back, {session.user.name?.split(' ')[0] || 'Student'}.</p>
        </div>
        <Link href="/student/book" className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl flex items-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1">
          <Calendar size={18} />
          Book Session
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Next Appointment Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary/90 p-8 sm:p-10 relative overflow-hidden flex flex-col justify-center items-start text-white rounded-3xl shadow-xl shadow-primary/10 group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Video size={200} className="-rotate-12 transform translate-x-8 -translate-y-8" />
          </div>
          
          <div className="relative z-10 w-full flex flex-col h-full justify-between gap-8">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white border border-white/20 rounded-full text-[10px] font-bold mb-6 uppercase tracking-widest backdrop-blur-md">Next Appointment</span>
              
              {nextSession ? (
                <>
                  <h3 className="text-3xl sm:text-4xl font-black mb-3 font-playfair tracking-tight leading-tight">{nextSession.time}</h3>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg text-sm">{nextSession.tutor}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span className="text-sm font-medium">{nextSession.type} ({nextSession.duration})</span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-black mb-3 font-playfair tracking-tight text-white/50">No upcoming sessions</h3>
                  <p className="text-white/60 font-medium">Ready to continue your progress?</p>
                </>
              )}
            </div>

            {nextSession ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link 
                  href={nextSession.url}
                  target="_blank"
                  className="px-8 py-3.5 bg-accent hover:bg-white hover:text-accent text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                >
                  <Play size={18} className="fill-current" /> Join Meeting
                </Link>
                <Link 
                  href="/student/appointments"
                  className="px-8 py-3.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-md"
                >
                  Manage
                </Link>
              </div>
            ) : (
              <div>
                <Link 
                  href="/student/book"
                  className="px-8 py-3.5 bg-accent hover:bg-white hover:text-accent text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl flex items-center gap-2 shadow-lg w-fit"
                >
                  Schedule Now <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Balances / Stats */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-5 group flex-1">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Award size={32} />
            </div>
            <div>
              <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Total Completed</p>
              <h4 className="text-3xl font-black text-primary font-playfair">{completedCount} <span className="text-base text-primary/40 font-sans font-medium">sessions</span></h4>
            </div>
          </div>

          <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-5 group flex-1">
             <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <CreditCard size={32} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Available Credits</p>
              {activePackages.length > 0 ? (
                <div>
                  <h4 className="text-3xl font-black text-primary font-playfair">{activePackages.reduce((acc, p) => acc + p.remainingSessions, 0)} <span className="text-base text-primary/40 font-sans font-medium">left</span></h4>
                  <p className="text-[10px] text-accent font-bold uppercase mt-1 truncate">{activePackages[0].package.name}</p>
                </div>
              ) : (
                <h4 className="text-xl font-black text-primary/50">None Active</h4>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Sessions List */}
        <div className="bg-white border border-secondary/30 flex flex-col overflow-hidden rounded-3xl shadow-sm h-full">
          <div className="p-8 border-b border-secondary/30 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight flex items-center gap-2">
              <Calendar className="text-accent" size={20} /> Schedule
            </h3>
            <Link href="/student/appointments" className="text-[10px] font-bold uppercase tracking-widest text-primary/50 hover:text-accent transition-colors bg-secondary/20 px-3 py-1.5 rounded-full hover:bg-secondary/40">View All</Link>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-2">
            {upcomingSessions.length > 0 ? upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 hover:bg-secondary/10 rounded-2xl transition-all duration-300 group border border-transparent hover:border-secondary/30">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-primary/5 text-primary flex items-center justify-center font-black text-lg font-playfair rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {session.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm mb-1 group-hover:text-accent transition-colors">{session.tutor}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                      <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-accent" /> {session.time}
                      </span>
                    </div>
                  </div>
                </div>
                {session.url && session.url !== '#' && (
                  <Link href={session.url} target="_blank" className="w-10 h-10 shrink-0 bg-secondary/20 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white rounded-lg transition-colors">
                    <Video size={16} />
                  </Link>
                )}
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-primary/30">
                  <Calendar size={24} />
                </div>
                <p className="text-primary/50 text-sm">Your schedule is clear.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Past Sessions */}
        <div className="bg-white border border-secondary/30 flex flex-col rounded-3xl shadow-sm overflow-hidden h-full">
           <div className="flex justify-between items-center p-8 border-b border-secondary/30 bg-white/50 backdrop-blur-sm">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight flex items-center gap-2">
              <History className="text-accent" size={20} /> Recent History
            </h3>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-2">
            {pastSessions.length > 0 ? pastSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-white border border-secondary/20 rounded-2xl transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-primary/50 rounded-xl">
                    <CheckCircle2 size={20} className="text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm font-sans">{session.tutor}</h4>
                    <div className="flex gap-2 mt-1 items-center">
                      <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">{session.time}</p>
                      <span className="w-1 h-1 rounded-full bg-secondary"></span>
                      <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">{session.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-primary/30">
                  <History size={24} />
                </div>
                <p className="text-primary/50 text-sm">No completed sessions yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}