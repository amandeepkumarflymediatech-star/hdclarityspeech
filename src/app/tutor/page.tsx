import { Calendar, Video, Clock, Users, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function TutorDashboard() {
  const stats = [
    { name: 'Today\'s Sessions', value: '4', icon: Calendar },
    { name: 'Hours Taught', value: '124', icon: Clock },
    { name: 'Active Students', value: '18', icon: Users },
  ];

  const upcomingSessions = [
    { id: 1, student: 'Alice Smith', time: '10:00 AM - 11:00 AM', type: 'Speech Articulation', initial: 'A' },
    { id: 2, student: 'David Johnson', time: '1:00 PM - 2:00 PM', type: 'Fluency Practice', initial: 'D' },
    { id: 3, student: 'Emma Wilson', time: '3:30 PM - 4:30 PM', type: 'Voice Therapy', initial: 'E' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-sm font-sans">Tutor Portal</h4>
          <h1 className="text-4xl font-black text-primary tracking-tight font-playfair">Dashboard</h1>
          <p className="text-primary/70 mt-2 font-sans text-lg">Ready for your classes today?</p>
        </div>
        <button className="px-8 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2 rounded-none">
          <Video size={18} />
          Join Next Live Room
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-secondary p-8 hover:bg-secondary/20 transition-colors duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">{stat.name}</p>
                <h3 className="text-4xl font-black text-primary mt-3 tracking-tight font-playfair">{stat.value}</h3>
              </div>
              <div className={`p-4 bg-secondary text-primary border border-primary/10`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white border border-secondary flex flex-col overflow-hidden">
          <div className="p-8 border-b border-secondary flex justify-between items-center bg-secondary/30">
            <h3 className="text-xl font-black text-primary font-playfair tracking-tight">Upcoming Sessions Today</h3>
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors">View Calendar</Link>
          </div>
          <div className="flex-1 p-4">
            {upcomingSessions.map((session, i) => (
              <div key={session.id} className="flex items-center justify-between p-6 hover:bg-secondary/20 border-b border-secondary last:border-0 transition group">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 bg-primary text-white flex items-center justify-center font-black text-xl font-playfair`}>
                    {session.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-lg mb-1">{session.student}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs font-bold text-primary/70 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} className="text-accent" /> {session.time}
                      </span>
                      <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1">
                        {session.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-12 h-12 border border-secondary flex items-center justify-center text-primary opacity-50 group-hover:opacity-100 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
                  <PlayCircle size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary border-l-4 border-accent p-10 relative overflow-hidden flex flex-col justify-center items-start text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Video size={150} className="-rotate-12 transform translate-x-8 -translate-y-8" />
          </div>
          <div className="relative z-10 w-full">
            <span className="inline-block px-4 py-1.5 bg-secondary text-primary text-xs font-bold mb-6 uppercase tracking-widest">Quick Action</span>
            <h3 className="text-3xl font-black mb-4 font-playfair tracking-tight">Start an Ad-hoc Meeting</h3>
            <p className="text-white/70 text-lg mb-8 font-sans leading-relaxed">Instantly generate a secure live room link to share with your student.</p>
            <button className="w-full bg-white text-primary px-8 py-5 font-bold hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-sm rounded-none">
              Generate Link <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}