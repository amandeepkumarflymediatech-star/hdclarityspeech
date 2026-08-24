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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.length === 0 && (
            <div className="col-span-full p-12 text-center text-primary/60 border border-secondary/30 bg-white rounded-3xl shadow-sm">
              No upcoming appointments.
            </div>
          )}
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white border border-secondary/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-secondary/10 text-[10px] font-bold uppercase tracking-widest text-primary border border-secondary/20 rounded-full">
                    {apt.booking?.sessionType?.name || 'Therapy Session'}
                  </span>
                  <span className="text-accent text-[10px] font-bold uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                    {apt.status}
                  </span>
                </div>
                
                <h4 className="font-bold text-primary text-xl flex items-center gap-2 mb-4 font-playfair">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center border border-secondary/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <User size={18} className="text-accent group-hover:text-white transition-colors" />
                  </div>
                  {apt.tutor?.name || 'Expert Tutor'}
                </h4>
                
                <div className="space-y-2.5 mt-6">
                  <p className="text-sm font-bold text-primary/70 uppercase tracking-widest flex items-center gap-3">
                    <CalendarIcon size={16} className="text-accent/70" /> {new Date(apt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm font-bold text-primary/70 uppercase tracking-widest flex items-center gap-3">
                    <Clock size={16} className="text-accent/70" /> {new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 p-4 bg-secondary/5 border-t border-secondary/30">
                <Link href={apt.rescheduleUrl || '#'} target="_blank" className="flex-1 py-3 text-center text-xs font-bold text-primary hover:bg-white bg-secondary/10 border border-secondary/30 transition-colors uppercase tracking-widest rounded-xl block">
                  Reschedule
                </Link>
                <Link href={apt.meetingUrl || '#'} target="_blank" className="flex-1 py-3 bg-accent hover:bg-accent/90 text-white text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 rounded-xl shadow-sm">
                  <Video size={16} /> Join Room
                </Link>
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
