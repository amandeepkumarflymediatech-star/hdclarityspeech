import { Users, Mail, Phone, Calendar, Search, ArrowUpRight, Award, History } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function TutorStudentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TUTOR") {
    redirect("/login");
  }

  // Fetch all unique students this tutor has had or will have a session with
  const sessions = await prisma.session.findMany({
    where: { tutorId: session.user.id },
    include: { student: true }
  });

  // Deduplicate students based on their ID
  const studentsMap = new Map();
  sessions.forEach(s => {
    if (!studentsMap.has(s.student.id)) {
      studentsMap.set(s.student.id, {
        user: s.student,
        totalSessions: 1,
        lastSession: s.scheduledAt
      });
    } else {
      const existing = studentsMap.get(s.student.id);
      existing.totalSessions += 1;
      if (new Date(s.scheduledAt) > new Date(existing.lastSession)) {
        existing.lastSession = s.scheduledAt;
      }
    }
  });

  const students = Array.from(studentsMap.values());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> My Roster
          </h4>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Students</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage and review progress for {students.length} active students.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full bg-white border border-secondary/40 pl-12 pr-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-full shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white border border-secondary/30 rounded-3xl shadow-sm">
            <Users size={48} className="mx-auto text-primary/20 mb-4" />
            <h3 className="text-xl font-bold text-primary font-playfair mb-2">No Students Yet</h3>
            <p className="text-primary/60">You don't have any students in your roster. Once you complete a session, they will appear here.</p>
          </div>
        ) : (
          students.map((student, i) => (
            <div key={student.user.id} className="bg-white border border-secondary/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group rounded-3xl overflow-hidden shadow-sm relative">
              <div className="p-6 pb-0 mb-4 flex justify-between items-start">
                <div className="w-16 h-16 bg-primary/5 flex items-center justify-center text-primary font-black font-playfair text-2xl rounded-2xl shadow-sm border border-secondary/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {student.user.name ? student.user.name[0].toUpperCase() : 'S'}
                </div>
                <div className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full border border-accent/20">
                  Active
                </div>
              </div>
              
              <div className="px-6 flex-1">
                <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-1">{student.user.name || 'Anonymous Student'}</h3>
                <p className="text-primary/50 text-xs flex items-center gap-2 mb-6">
                  <Mail size={12} /> {student.user.email}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/20 flex flex-col justify-center">
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-1">Total Sessions</p>
                    <p className="text-lg font-black text-primary flex items-center gap-1.5"><History size={14} className="text-accent" /> {student.totalSessions}</p>
                  </div>
                  <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/20 flex flex-col justify-center">
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest mb-1">Last Session</p>
                    <p className="text-sm font-bold text-primary">{new Date(student.lastSession).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 p-4 bg-secondary/5 border-t border-secondary/30 mt-auto">
                <button className="flex-1 py-3 bg-white border border-secondary/30 text-primary font-bold uppercase tracking-widest text-[10px] hover:border-accent hover:text-accent transition-colors rounded-xl shadow-sm flex items-center justify-center gap-2">
                  <Mail size={14} /> Message
                </button>
                <button className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] transition-colors rounded-xl shadow-sm flex items-center justify-center gap-2">
                  Notes <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
