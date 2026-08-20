import { Video, Mic, MicOff, VideoOff, MessageSquare, PhoneMissed, Users, Settings } from "lucide-react";

export default function TutorLiveRoomPage() {
  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] bg-primary flex flex-col sm:flex-row relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans border-2 border-primary">
      
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative bg-black">
        {/* Remote Video (Student) Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-secondary text-primary flex items-center justify-center text-5xl font-black font-playfair shadow-2xl">
            A
          </div>
          <p className="absolute bottom-6 left-6 text-white font-bold bg-black/50 px-3 py-1 text-sm tracking-widest uppercase border border-white/20">Alice Smith</p>
        </div>

        {/* Local Video (Tutor) Placeholder */}
        <div className="absolute top-6 right-6 w-48 h-32 bg-primary/80 border-2 border-white/20 shadow-2xl flex items-center justify-center backdrop-blur-sm z-10 overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-black font-playfair shadow-xl">
            T
          </div>
          <p className="absolute bottom-2 left-2 text-white font-bold text-xs bg-black/50 px-2 py-0.5 tracking-widest uppercase">You</p>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-4 sm:gap-6 px-4 z-20">
          <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20">
            <Mic size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20">
            <Video size={20} />
          </button>
          <button className="w-14 h-14 rounded-full bg-accent hover:bg-red-800 text-white flex items-center justify-center transition-all shadow-[0_0_20px_-5px_rgba(175,11,44,0.6)] border-2 border-accent hover:scale-105">
            <PhoneMissed size={24} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar (Chat & Participants) */}
      <div className="w-full sm:w-80 bg-white border-l border-secondary flex flex-col z-30 shrink-0">
        <div className="flex border-b border-secondary">
          <button className="flex-1 py-4 text-xs font-bold text-primary border-b-2 border-primary uppercase tracking-widest text-center">Chat</button>
          <button className="flex-1 py-4 text-xs font-bold text-primary/50 hover:text-primary border-b-2 border-transparent uppercase tracking-widest text-center transition-colors">Participants (2)</button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-secondary/10">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">Alice</span>
            <div className="bg-white border border-secondary p-3 text-sm text-primary shadow-sm rounded-r-xl rounded-bl-xl">
              Hi, I'm ready for the session!
            </div>
            <span className="text-[10px] text-primary/40 font-bold">10:00 AM</span>
          </div>
          
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">You</span>
            <div className="bg-primary text-white p-3 text-sm shadow-sm rounded-l-xl rounded-br-xl">
              Great, let's start with the articulation exercises.
            </div>
            <span className="text-[10px] text-primary/40 font-bold">10:02 AM</span>
          </div>
        </div>

        <div className="p-4 border-t border-secondary bg-white">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="w-full bg-secondary/30 border border-secondary pl-4 pr-10 py-3 text-sm focus:border-accent text-primary outline-none transition-colors rounded-full"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-accent p-1.5 hover:bg-secondary rounded-full transition-colors">
              <MessageSquare size={16} />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
