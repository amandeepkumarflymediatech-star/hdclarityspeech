import { Calendar as CalendarIcon, Clock, Video, FileText, User } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentAppointmentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const appointments = await prisma.appointment.findMany({
    where: { studentId: session.user.id, status: { in: ['SCHEDULED', 'UPCOMING'] } },
    include: { tutor: true },
    orderBy: { scheduledAt: 'asc' }
  });

  const pastAppointments = await prisma.appointment.findMany({
    where: { studentId: session.user.id, status: 'COMPLETED' },
    include: { tutor: true },
    orderBy: { scheduledAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">My Sessions</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">View and join your upcoming therapy sessions.</p>
        </div>
        <button className="px-8 py-4 bg-primary hover:bg-accent text-white font-bold uppercase tracking-wider text-sm transition-colors rounded-none flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
          <CalendarIcon size={18} />
          Book New Session
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-primary font-playfair tracking-tight border-b border-secondary pb-2">Upcoming</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.length === 0 && (
            <div className="col-span-full p-8 text-center text-primary/60 border border-secondary bg-white">
              No upcoming appointments.
            </div>
          )}
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white border border-secondary flex flex-col hover:shadow-md transition-shadow group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-secondary/30 text-xs font-bold uppercase tracking-widest text-primary border border-secondary">
                    Speech Therapy
                  </span>
                  <span className="text-accent text-xs font-bold uppercase tracking-widest bg-accent/10 px-2 py-1">
                    {apt.status}
                  </span>
                </div>
                
                <h4 className="font-bold text-primary text-xl flex items-center gap-2 mb-4 font-playfair">
                  <User size={18} className="text-accent" /> {apt.tutor?.name || 'Expert Tutor'}
                </h4>
                
                <div className="space-y-2">
                  <p className="text-sm font-bold text-primary/70 uppercase tracking-widest flex items-center gap-3">
                    <CalendarIcon size={16} /> {new Date(apt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm font-bold text-primary/70 uppercase tracking-widest flex items-center gap-3">
                    <Clock size={16} /> {new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <div className="flex border-t border-secondary">
                <button className="flex-1 py-4 text-xs font-bold text-primary hover:bg-secondary/30 transition-colors uppercase tracking-widest">
                  Reschedule
                </button>
                <button className="flex-1 py-4 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                  <Video size={16} /> Join Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <h3 className="text-xl font-black text-primary font-playfair tracking-tight border-b border-secondary pb-2">Past Sessions</h3>
        
        <div className="space-y-4">
          {pastAppointments.length === 0 && (
            <div className="p-8 text-center text-primary/60 border border-secondary bg-white">
              No past appointments.
            </div>
          )}
          {pastAppointments.map((apt) => (
            <div key={apt.id} className="bg-white border border-secondary p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h4 className="font-bold text-primary text-lg mb-1">Speech Therapy with {apt.tutor?.name || 'Expert Tutor'}</h4>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-3">{new Date(apt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-sm text-primary/80 font-sans italic flex items-center gap-2">
                  <FileText size={14} className="text-accent" /> "Completed"
                </p>
              </div>
              <button className="px-6 py-3 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors whitespace-nowrap w-full md:w-auto text-center">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
