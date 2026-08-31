import { Calendar as CalendarIcon, Clock, Video, FileText, User, X } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cleanupPastSessions } from "@/actions/session-actions";

export default async function StudentAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string, details?: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'upcoming';
  const detailsId = resolvedSearchParams.details;

  // Lazy evaluation: Cleanup any past sessions before fetching the UI lists
  await cleanupPastSessions(session.user.id);

  let statusFilter: string | string[] = ['SCHEDULED', 'IN_PROGRESS', 'UPCOMING'];
  let orderDirection: 'asc' | 'desc' = 'asc';
  
  if (filter === 'complete') {
    statusFilter = 'COMPLETED';
    orderDirection = 'desc';
  } else if (filter === 'cancelled') {
    statusFilter = 'CANCELLED';
    orderDirection = 'desc';
  } else if (filter === 'missing') {
    statusFilter = 'NO_SHOW';
    orderDirection = 'desc';
  }

  const appointments = await prisma.session.findMany({
    where: { 
      studentId: session.user.id, 
      status: Array.isArray(statusFilter) ? { in: statusFilter } : statusFilter 
    },
    include: { tutor: true, booking: { include: { sessionType: true } } },
    orderBy: { scheduledAt: orderDirection }
  });

  let selectedSession = null;
  if (detailsId) {
    selectedSession = appointments.find(a => a.id === detailsId);
    if (!selectedSession) {
      selectedSession = await prisma.session.findUnique({
         where: { id: detailsId },
         include: { tutor: true, booking: { include: { sessionType: true } } }
      });
    }
  }

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
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center pb-2 border-b border-secondary/30 gap-4">
          <h3 className="text-xl font-black text-primary font-playfair tracking-tight capitalize">{filter} Sessions</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 w-full xl:w-auto">
            <Link href="?filter=upcoming" className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${filter === 'upcoming' ? 'bg-primary text-white' : 'bg-secondary/10 text-primary hover:bg-secondary/20'}`}>Upcoming</Link>
            <Link href="?filter=complete" className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${filter === 'complete' ? 'bg-primary text-white' : 'bg-secondary/10 text-primary hover:bg-secondary/20'}`}>Completed</Link>
            <Link href="?filter=cancelled" className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${filter === 'cancelled' ? 'bg-primary text-white' : 'bg-secondary/10 text-primary hover:bg-secondary/20'}`}>Cancelled</Link>
            <Link href="?filter=missing" className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${filter === 'missing' ? 'bg-primary text-white' : 'bg-secondary/10 text-primary hover:bg-secondary/20'}`}>Missing</Link>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {appointments.length === 0 && (
            <div className="p-12 text-center text-primary/60 border border-secondary/30 bg-white rounded-3xl shadow-sm">
              No {filter} appointments found.
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
                {['SCHEDULED', 'IN_PROGRESS', 'UPCOMING'].includes(apt.status) ? (
                  <>
                    {apt.rescheduleUrl ? (
                      <Link href={apt.rescheduleUrl} target="_blank" className="flex-1 sm:flex-none px-6 py-3 text-center text-xs font-bold text-primary hover:bg-white bg-secondary/10 border border-secondary/30 transition-colors uppercase tracking-widest rounded-xl block">
                        Reschedule
                      </Link>
                    ) : (
                      <button disabled className="flex-1 sm:flex-none px-6 py-3 text-center text-xs font-bold text-primary/40 bg-secondary/5 border border-secondary/20 uppercase tracking-widest rounded-xl cursor-not-allowed block" title="No reschedule link available">
                        Reschedule
                      </button>
                    )}
                    {apt.meetingUrl ? (
                      <Link href={apt.meetingUrl} target="_blank" className="flex-1 sm:flex-none px-6 py-3 bg-accent hover:bg-accent/90 text-white text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 rounded-xl shadow-sm block">
                        <Video size={16} className="inline-block -mt-0.5" /> Join Room
                      </Link>
                    ) : (
                      <button disabled className="flex-1 sm:flex-none px-6 py-3 bg-accent/50 text-white/70 text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2 rounded-xl shadow-sm cursor-not-allowed block" title="Meeting link not generated yet">
                        <Video size={16} className="inline-block -mt-0.5" /> Join Room
                      </button>
                    )}
                  </>
                ) : (
                  <Link href={`?filter=${filter}&details=${apt.id}`} scroll={false} className="flex-1 sm:flex-none px-6 py-3 border border-secondary/50 text-primary font-bold uppercase tracking-widest text-xs hover:border-accent hover:text-accent transition-colors whitespace-nowrap w-full text-center rounded-xl bg-secondary/5 block">
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <Link href={`?filter=${filter}`} scroll={false} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary/20 hover:bg-secondary/40 text-primary transition-colors">
              <X size={16} />
            </Link>
            <h3 className="text-2xl font-black text-primary font-playfair mb-4">Session Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Tutor</p>
                <p className="font-medium text-primary">{selectedSession.tutor?.name || 'Unknown'}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Type</p>
                <p className="font-medium text-primary">{selectedSession.booking?.sessionType?.name || 'Therapy Session'}</p>
              </div>
              
              <div className="flex gap-8">
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Date</p>
                  <p className="font-medium text-primary">{new Date(selectedSession.scheduledAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Time</p>
                  <p className="font-medium text-primary">{new Date(selectedSession.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Status</p>
                <span className="inline-block px-2.5 py-1 mt-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-lg border border-accent/20">
                  {selectedSession.status}
                </span>
              </div>
              
              {selectedSession.tutorNotes && (
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Tutor Notes</p>
                  <div className="p-4 bg-secondary/10 rounded-xl mt-1 text-sm text-primary/80 border border-secondary/20">
                    {selectedSession.tutorNotes}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <Link href={`?filter=${filter}`} scroll={false} className="block w-full py-3 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-primary text-center font-bold uppercase tracking-widest text-xs rounded-xl transition-colors">
                Close
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
