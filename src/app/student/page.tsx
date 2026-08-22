import { Calendar, Video, Award, Clock, ArrowRight, PlayCircle, Target, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StudentDashboard() {
  const upcomingSessions = [
    { id: 1, tutor: 'Sarah Tutor', time: 'Tomorrow, 10:00 AM', type: 'Speech Articulation', duration: '60 min', initial: 'S' },
    { id: 2, tutor: 'John Tutor', time: 'Thursday, 3:30 PM', type: 'Fluency Practice', duration: '45 min', initial: 'J' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Student Portal
          </h4>
          <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 font-sans text-lg">Keep up the great work. Let's hit today's goals.</p>
        </div>
        <button className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl flex items-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1">
          <BookOpen size={18} />
          Start Practice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Goal Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary/90 p-10 relative overflow-hidden flex flex-col justify-center items-start text-white rounded-3xl shadow-xl shadow-primary/10 group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Target size={200} className="-rotate-12 transform translate-x-8 -translate-y-8" />
          </div>
          <div className="relative z-10 w-full">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-6">
              <div>
                <span className="inline-block px-4 py-1.5 bg-white/10 text-white border border-white/20 rounded-full text-[10px] font-bold mb-6 uppercase tracking-widest backdrop-blur-md">Weekly Goal</span>
                <h3 className="text-3xl font-black mb-2 font-playfair tracking-tight">3 / 5 Practice Sessions</h3>
                <p className="text-white/70 text-base font-sans">You're on a 4-week streak!</p>
              </div>
              <div className="w-20 h-20 bg-accent text-white flex items-center justify-center relative font-black text-2xl rounded-2xl shadow-lg border border-accent-light">
                60%
              </div>
            </div>
            
            <div className="w-full bg-white/10 h-3 mt-4 rounded-full overflow-hidden backdrop-blur-md border border-white/10">
              <div className="bg-accent h-3 w-[60%] rounded-full shadow-[0_0_15px_rgba(var(--accent),0.8)] relative">
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Card */}
        <div className="bg-white border border-secondary/30 p-10 flex flex-col justify-center text-center rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/30 transition-colors"></div>
          
          <div className="w-20 h-20 bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6 rounded-3xl border border-accent/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner relative z-10">
            <Award size={40} />
          </div>
          <h3 className="text-2xl font-black text-primary font-playfair tracking-tight relative z-10">Level 3</h3>
          <p className="text-[10px] font-bold text-accent uppercase tracking-widest mt-2 relative z-10">Articulation Master</p>
          <p className="text-sm text-primary/60 mt-6 font-sans leading-relaxed relative z-10">
            Complete 2 more speech exercises to unlock Level 4.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Sessions */}
        <div className="bg-white border border-secondary/30 flex flex-col overflow-hidden rounded-3xl shadow-sm">
          <div className="p-8 border-b border-secondary/30 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Upcoming Sessions</h3>
            <Link href="/student/appointments" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors bg-accent/10 px-3 py-1.5 rounded-full hover:bg-secondary/20">View All</Link>
          </div>
          <div className="flex-1 p-4 space-y-2">
            {upcomingSessions.length > 0 ? upcomingSessions.map((session, i) => (
              <div key={session.id} className="flex items-center justify-between p-4 hover:bg-secondary/10 rounded-2xl transition-all duration-300 group border border-transparent hover:border-secondary/30 hover:shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary/5 text-primary flex items-center justify-center font-black text-xl font-playfair rounded-2xl border border-secondary/30 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {session.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-base mb-1 group-hover:text-accent transition-colors">{session.tutor}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1.5">
                      <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-accent" /> {session.time}
                      </span>
                      <span className="text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-md">
                        {session.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-12 h-12 shrink-0 bg-secondary/10 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white rounded-xl transition-all duration-300 shadow-sm group-hover:shadow-md hover:scale-105">
                  <Video size={18} />
                </button>
              </div>
            )) : (
              <div className="p-10 text-center text-primary/50 font-sans italic">No upcoming sessions.</div>
            )}
          </div>
          <div className="p-4 bg-secondary/5 border-t border-secondary/30">
             <Link href="/student/book" className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs text-primary hover:text-accent transition-colors w-full py-3 bg-white rounded-xl shadow-sm border border-secondary/20 hover:border-accent/30 group">
               <span className="text-accent group-hover:scale-125 transition-transform">+</span> Book a New Session
             </Link>
          </div>
        </div>
        
        {/* Recommended Practice */}
        <div className="bg-white border border-secondary/30 flex flex-col rounded-3xl shadow-sm overflow-hidden">
           <div className="flex justify-between items-center p-8 pb-6 border-b border-secondary/30 bg-white/50 backdrop-blur-sm">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Recommended Practice</h3>
            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors bg-accent/10 px-3 py-1.5 rounded-full hover:bg-secondary/20">Library</Link>
          </div>
          <div className="p-4 space-y-2">
            {[
              { title: 'Vowel Pronunciation Drill', time: '10 min', icon: PlayCircle },
              { title: 'Breathing Exercises for Fluency', time: '15 min', icon: PlayCircle },
              { title: 'Consonant Cluster Practice', time: '5 min', icon: PlayCircle },
            ].map((practice, i) => {
              const Icon = practice.icon;
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-secondary/20 hover:border-accent/40 hover:bg-secondary/5 rounded-2xl transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-primary group-hover:text-accent group-hover:bg-accent/10 rounded-xl transition-colors">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm font-sans group-hover:text-accent transition-colors">{practice.title}</h4>
                      <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest mt-1">{practice.time}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}