import { Calendar as CalendarIcon, Clock, Video, FileText, User } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentAppointmentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Changed from prisma.appointment to prisma.session based on schema
  const appointments = await prisma.session.findMany({
    where: { studentId: session.user.id, status: { in: ['SCHEDULED', 'UPCOMING'] } },
    include: { tutor: true, booking: { include: { sessionType: true } } },
    orderBy: { scheduledAt: 'asc' }
  });

  const pastAppointments = await prisma.session.findMany({
    where: { studentId: session.user.id, status: 'COMPLETED' },
    include: { tutor: true, booking: { include: { sessionType: true } } },
    orderBy: { scheduledAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">My Sessions</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">View and join your upcoming therapy sessions.</p>
        </div>
        <Link href="/student/book" className="px-8 py-4 bg-primary hover:bg-accent text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-accent/40 hover:-translate-y-1">
          <CalendarIcon size={18} />
          Book New Session
        </Link>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-primary font-playfair tracking-tight border-b border-secondary/30 pb-2">Upcoming</h3>
        
        <div className="flex flex-col gap-4">
          {appointments.length === 0 && (
            <div className="p-12 text-center text-primary/60 border border-secondary/30 bg-white rounded-3xl shadow-sm">
              No upcoming appointments.
            </div>
          )}
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white border border-secondary/30 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start md:items-center gap-6 flex-1 w-full md:w-auto">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex shrink-0 items-center justify-center border border-secondary/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-accent">
                  <User size={24} className="group-hover:text-white transition-colors" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <span className="inline-block px-2.5 py-1 bg-secondary/10 text-[10px] font-bold uppercase tracking-widest text-primary border border-secondary/20 rounded-lg">
                      {apt.booking?.sessionType?.name || 'Therapy Session'}
                    </span>
                    <span className="text-accent text-[10px] font-bold uppercase tracking-widest bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20">
                      {apt.status}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-primary text-xl font-playfair mb-2">
                    {apt.tutor?.name || 'Expert Tutor'}
                  </h4>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs font-bold text-primary/70 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <CalendarIcon size={14} className="text-accent" /> {new Date(apt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-accent" /> {new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col lg:flex-row gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-secondary/30 pt-4 md:pt-0 md:pl-6 shrink-0">
                {apt.rescheduleUrl ? (
                  <Link href={apt.rescheduleUrl} target="_blank" className="flex-1 sm:flex-none px-6 py-3 text-center text-xs font-bold text-primary hover:bg-white bg-secondary/10 border border-secondary/30 transition-colors uppercase tracking-widest rounded-xl">
                    Reschedule
                  </Link>
                ) : (
                  <button disabled className="flex-1 sm:flex-none px-6 py-3 text-center text-xs font-bold text-primary/40 bg-secondary/5 border border-secondary/20 uppercase tracking-widest rounded-xl cursor-not-allowed" title="No reschedule link available">
                    Reschedule
                  </button>
                )}
                {apt.meetingUrl ? (
                  <Link href={apt.meetingUrl} target="_blank" className="flex-1 sm:flex-none px-6 py-3 bg-accent hover:bg-accent/90 text-white text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 rounded-xl shadow-sm">
                    <Video size={16} /> Join Room
                  </Link>
                ) : (
                  <button disabled className="flex-1 sm:flex-none px-6 py-3 bg-accent/50 text-white/70 text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2 rounded-xl shadow-sm cursor-not-allowed" title="Meeting link not generated yet">
                    <Video size={16} /> Join Room
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <h3 className="text-xl font-black text-primary font-playfair tracking-tight border-b border-secondary/30 pb-2">Past Sessions</h3>
        
        <div className="space-y-4">
          {pastAppointments.length === 0 && (
            <div className="p-8 text-center text-primary/60 border border-secondary/30 bg-white rounded-3xl shadow-sm">
              No past appointments.
            </div>
          )}
          {pastAppointments.map((apt) => (
            <div key={apt.id} className="bg-white border border-secondary/30 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-primary/50 border border-secondary/30">
                   <Clock size={20} />
                 </div>
                 <div>
                  <h4 className="font-bold text-primary text-base mb-1">{apt.booking?.sessionType?.name || 'Therapy Session'} with {apt.tutor?.name || 'Expert Tutor'}</h4>
                  <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest mb-1">{new Date(apt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-xs text-primary/70 font-sans flex items-center gap-1.5 mt-2">
                    <FileText size={14} className="text-accent" /> Completed
                  </p>
                 </div>
              </div>
              <button className="px-6 py-3 border border-secondary/50 text-primary font-bold uppercase tracking-widest text-xs hover:border-accent hover:text-accent transition-colors whitespace-nowrap w-full md:w-auto text-center rounded-xl bg-secondary/5">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
