import { Calendar, Video, Clock, Users, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TutorDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TUTOR') {
    redirect('/login');
  }

  const tutorId = session.user.id;

  // Calculate today's date range
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);

  // Fetch Stats
  const todaySessionsCount = await prisma.session.count({
    where: {
      tutorId,
      scheduledAt: { gte: startOfDay, lte: endOfDay },
      status: { not: 'CANCELLED' }
    }
  });

  const allCompletedSessions = await prisma.session.findMany({
    where: { tutorId, status: 'COMPLETED' },
    select: { scheduledAt: true, endTime: true }
  });

  const totalMinutes = allCompletedSessions.reduce((acc, s) => {
    return acc + (s.endTime.getTime() - s.scheduledAt.getTime()) / 60000;
  }, 0);
  const hoursTaught = Math.round(totalMinutes / 60);

  const activeStudentsGroup = await prisma.booking.groupBy({
    by: ['studentId'],
    where: { tutorId }
  });
  const activeStudents = activeStudentsGroup.length;

  const stats = [
    { name: 'Today\'s Sessions', value: todaySessionsCount.toString(), icon: Calendar },
    { name: 'Hours Taught', value: hoursTaught.toString(), icon: Clock },
    { name: 'Active Students', value: activeStudents.toString(), icon: Users },
  ];

  // Fetch upcoming sessions for today
  const upcomingSessionsDb = await prisma.session.findMany({
    where: {
      tutorId,
      scheduledAt: { gte: new Date(), lte: endOfDay },
      status: { notIn: ['CANCELLED', 'COMPLETED'] }
    },
    orderBy: { scheduledAt: 'asc' },
    take: 3,
    include: {
      student: { select: { name: true } },
      booking: { include: { sessionType: true } }
    }
  });

  const upcomingSessions = upcomingSessionsDb.map(s => {
    const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return {
      id: s.id,
      student: s.student.name || 'Unknown Student',
      time: `${formatTime(s.scheduledAt)} - ${formatTime(s.endTime)}`,
      type: s.booking.sessionType.name,
      initial: (s.student.name || 'U').charAt(0).toUpperCase(),
      meetingUrl: s.meetingUrl
    }
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans bg-accent/10 text-accent px-3 py-1 rounded-full w-fit">Tutor Portal</h4>
          <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 font-sans text-lg">Ready for your classes today?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest group-hover:text-accent transition-colors">{stat.name}</p>
                <h3 className="text-4xl font-black text-primary mt-3 tracking-tight font-playfair">{stat.value}</h3>
              </div>
              <div className={`p-4 bg-secondary/20 text-primary rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors duration-300`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        <div className="bg-white border border-secondary/30 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-8 border-b border-secondary/30 flex justify-between items-center bg-secondary/5">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Upcoming Sessions Today</h3>
            <Link href="/tutor/appointments" className="text-xs font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors bg-accent/10 px-4 py-2 rounded-full">View Calendar</Link>
          </div>
          <div className="flex-1 p-2 min-h-[300px]">
            {upcomingSessions.length === 0 ? (
              <div className="flex items-center justify-center h-full flex-col text-primary/40">
                <Calendar size={48} className="mb-4 opacity-50" />
                <p className="font-bold">No more sessions today!</p>
                <p className="text-sm">Enjoy your free time.</p>
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-6 hover:bg-secondary/10 rounded-2xl transition-all group mb-2 last:mb-0">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center font-black text-xl font-playfair rounded-2xl`}>
                      {session.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-lg mb-1">{session.student}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-bold text-primary/60 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={14} className="text-accent" /> {session.time}
                        </span>
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                          {session.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  {session.meetingUrl ? (
                    <a href={session.meetingUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border-2 border-secondary/50 flex items-center justify-center text-primary/40 group-hover:text-white group-hover:bg-accent group-hover:border-accent group-hover:scale-110 transition-all shadow-sm">
                      <PlayCircle size={24} />
                    </a>
                  ) : (
                    <div className="text-xs text-primary/40 italic font-bold uppercase tracking-widest px-4">No Link</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}