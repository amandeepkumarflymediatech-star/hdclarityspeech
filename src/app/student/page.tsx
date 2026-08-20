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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans">Student Portal</h4>
          <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 font-sans text-lg">Keep up the great work. Let's hit today's goals.</p>
        </div>
        <button className="px-8 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2 rounded-none">
          <BookOpen size={18} />
          Start Practice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Goal Card */}
        <div className="md:col-span-2 bg-primary border-l-4 border-accent p-10 relative overflow-hidden flex flex-col justify-center items-start text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Target size={180} className="-rotate-12 transform translate-x-8 -translate-y-8" />
          </div>
          <div className="relative z-10 w-full">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="inline-block px-4 py-1.5 bg-secondary text-primary text-xs font-bold mb-6 uppercase tracking-widest">Weekly Goal</span>
                <h3 className="text-3xl font-black mb-2 font-playfair tracking-tight">3 / 5 Practice Sessions</h3>
                <p className="text-white/70 text-lg font-sans">You're on a 4-week streak!</p>
              </div>
              <div className="w-20 h-20 bg-accent text-white flex items-center justify-center relative font-black text-2xl border-4 border-white/20">
                60%
              </div>
            </div>
            
            <div className="w-full bg-white/20 h-2 mt-4">
              <div className="bg-accent h-2 w-[60%]"></div>
            </div>
          </div>
        </div>

        {/* Level Card */}
        <div className="bg-white border border-secondary p-10 flex flex-col justify-center text-center hover:bg-secondary/20 transition-colors">
          <div className="w-20 h-20 border border-secondary bg-white text-accent flex items-center justify-center mx-auto mb-6">
            <Award size={40} />
          </div>
          <h3 className="text-2xl font-black text-primary font-playfair tracking-tight">Level 3</h3>
          <p className="text-sm font-bold text-accent uppercase tracking-widest mt-2">Articulation Master</p>
          <p className="text-sm text-primary/70 mt-6 font-sans leading-relaxed">
            Complete 2 more speech exercises to unlock Level 4.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Sessions */}
        <div className="bg-white border border-secondary flex flex-col overflow-hidden">
          <div className="p-8 border-b border-secondary flex justify-between items-center bg-secondary/30">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Upcoming Sessions</h3>
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors">View All</Link>
          </div>
          <div className="flex-1 p-4">
            {upcomingSessions.length > 0 ? upcomingSessions.map((session, i) => (
              <div key={session.id} className="flex items-center justify-between p-6 hover:bg-secondary/20 border-b border-secondary last:border-0 transition group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary text-white flex items-center justify-center font-black text-xl font-playfair">
                    {session.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-lg mb-1">{session.tutor}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                      <span className="text-xs font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} className="text-accent" /> {session.time}
                      </span>
                      <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1">
                        {session.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-12 h-12 shrink-0 border border-secondary flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors">
                  <Video size={20} />
                </button>
              </div>
            )) : (
              <div className="p-10 text-center text-primary/50 font-sans italic">No upcoming sessions.</div>
            )}
          </div>
          <div className="p-6 bg-secondary/30 border-t border-secondary text-center">
             <button className="font-bold uppercase tracking-widest text-xs text-primary hover:text-accent transition-colors">
               + Book a New Session
             </button>
          </div>
        </div>
        
        {/* Recommended Practice */}
        <div className="bg-white border border-secondary p-8 flex flex-col">
           <div className="flex justify-between items-center mb-8 pb-6 border-b border-secondary">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Recommended Practice</h3>
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors">View Library</Link>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Vowel Pronunciation Drill', time: '10 min' },
              { title: 'Breathing Exercises for Fluency', time: '15 min' },
              { title: 'Consonant Cluster Practice', time: '5 min' },
            ].map((practice, i) => (
              <div key={i} className="flex items-center justify-between p-6 border border-secondary hover:border-accent hover:bg-secondary/10 transition cursor-pointer group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 border border-secondary flex items-center justify-center text-primary group-hover:text-accent group-hover:border-accent transition-colors">
                    <PlayCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-base font-sans">{practice.title}</h4>
                    <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mt-2">{practice.time}</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-secondary group-hover:text-accent group-hover:translate-x-2 transition-transform" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}