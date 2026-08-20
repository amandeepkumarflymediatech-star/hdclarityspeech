import { Calendar as CalendarIcon, Clock, Video, User, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TutorAppointmentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TUTOR") {
    redirect("/login");
  }

  const appointments = await prisma.appointment.findMany({
    where: { tutorId: session.user.id },
    include: { student: true },
    orderBy: { scheduledAt: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Appointments</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage your upcoming therapy sessions.</p>
        </div>
        <button className="px-8 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-colors rounded-none flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
          <Plus size={18} />
          New Availability
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-secondary">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Upcoming Sessions</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest border border-primary transition-colors">List</button>
              <button className="px-4 py-2 bg-secondary/30 text-primary hover:bg-secondary text-xs font-bold uppercase tracking-widest border border-secondary transition-colors">Calendar</button>
            </div>
          </div>

          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white border border-secondary p-6 hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-none bg-secondary/50 text-primary border border-secondary group-hover:bg-primary group-hover:text-white transition-colors`}>
                    <CalendarIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                      <User size={16} className="text-accent" /> {apt.student?.name || 'Unknown Student'}
                    </h4>
                    <p className="text-sm font-bold text-primary/60 mt-1 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> {new Date(apt.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(apt.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className="inline-block px-2 py-1 mt-3 bg-secondary/30 text-xs font-bold uppercase tracking-widest text-primary border border-secondary">
                      {apt.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors text-center">
                    Reschedule
                  </button>
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-accent hover:bg-primary text-white font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 text-center shadow-sm">
                    <Video size={16} /> Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-secondary p-8 shadow-sm flex flex-col sticky top-24">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-6 pb-4 border-b border-secondary">Quick Stats</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-1">Today's Sessions</p>
                <p className="text-3xl font-black text-primary font-playfair">2</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-1">Weekly Hours</p>
                <p className="text-3xl font-black text-primary font-playfair">18.5</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-1">Pending Requests</p>
                <p className="text-3xl font-black text-accent font-playfair">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
