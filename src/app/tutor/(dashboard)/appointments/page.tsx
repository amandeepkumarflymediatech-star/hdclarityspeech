import { Calendar as CalendarIcon, Clock, Video, User, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AppointmentActions from "./_components/AppointmentActions";

export default async function TutorAppointmentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TUTOR") {
    redirect("/login");
  }

  const appointments = await prisma.session.findMany({
    where: { tutorId: session.user.id },
    include: { student: true },
    orderBy: { scheduledAt: 'asc' }
  });

  const pendingRequests = await prisma.booking.count({
    where: { 
      tutorId: session.user.id, 
      status: { in: ['PENDING_PAYMENT', 'WAITING_FOR_SCHEDULING'] } 
    }
  });

  // Calculate total hours for this week
  const thisWeekSessions = appointments.filter(a => {
    const d = new Date(a.scheduledAt);
    const now = new Date();
    return d >= new Date(now.setDate(now.getDate() - now.getDay())) && d <= new Date(now.setDate(now.getDate() - now.getDay() + 6));
  });
  const totalWeeklyMinutes = thisWeekSessions.reduce((acc, s) => {
    return acc + (s.endTime.getTime() - s.scheduledAt.getTime()) / 60000;
  }, 0);
  const weeklyHours = Math.round(totalWeeklyMinutes / 60);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Appointments</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage your upcoming therapy sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-secondary/30">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Upcoming Sessions</h3>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 && (
              <div className="bg-white border border-secondary/30 rounded-3xl p-12 text-center text-primary/50 font-medium">
                No upcoming sessions found.
              </div>
            )}
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white border border-secondary/30 p-6 rounded-3xl hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className={`p-4 rounded-2xl bg-secondary/20 text-primary border border-secondary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                    <CalendarIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                      <User size={16} className="text-accent" /> {apt.student?.name || 'Unknown Student'}
                    </h4>
                    <p className="text-sm font-bold text-primary/50 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={14} /> {new Date(apt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className="inline-block px-3 py-1 mt-3 bg-secondary/20 text-[10px] font-bold uppercase tracking-widest text-primary rounded-full border border-secondary/30">
                      {apt.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
                  {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                    <AppointmentActions sessionId={apt.id} />
                  )}
                  {apt.status !== 'CANCELLED' && apt.meetingUrl && (
                    <a href={apt.meetingUrl} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-xl flex items-center justify-center gap-2 text-center shadow-sm">
                      <Video size={16} /> Join Meet
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-secondary/30 rounded-3xl p-8 shadow-sm flex flex-col sticky top-24">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-6 pb-4 border-b border-secondary/30">Quick Stats</h3>
            <div className="space-y-6">
              <div className="group">
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1 group-hover:text-accent transition-colors">Today's Sessions</p>
                <p className="text-3xl font-black text-primary font-playfair">{appointments.filter(a => new Date(a.scheduledAt).toDateString() === new Date().toDateString()).length}</p>
              </div>
              <div className="group">
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1 group-hover:text-accent transition-colors">Weekly Hours</p>
                <p className="text-3xl font-black text-primary font-playfair">{weeklyHours} hr</p>
              </div>
              <div className="group">
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1 group-hover:text-accent transition-colors">Pending Requests</p>
                <p className="text-3xl font-black text-accent font-playfair">{pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
