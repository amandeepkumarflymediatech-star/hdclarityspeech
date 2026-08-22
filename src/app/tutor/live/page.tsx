import { Video, Mic, MicOff, VideoOff, PhoneOff, Settings, Users, MessageSquare, MonitorUp, Focus } from "lucide-react";

export default function TutorLiveRoomPage({ searchParams }: { searchParams: { sessionId?: string } }) {
  return (
    <div className="h-[calc(100vh-120px)] w-full flex flex-col bg-[#0f172a] rounded-3xl overflow-hidden border border-secondary/20 shadow-2xl relative font-sans">
      
      {/* Top Header */}
      <div className="h-16 bg-[#1e293b] border-b border-white/10 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 border border-red-500/30">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> Live
          </div>
          <span className="text-white font-bold font-playfair tracking-tight">Speech Therapy Session</span>
        </div>
        <div className="flex items-center gap-4 text-white/70">
          <span className="text-sm font-bold">00:00</span>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
            <Users size={18} />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-4 flex flex-col md:flex-row gap-4 relative">
        {/* Remote Video (Student) */}
        <div className="flex-1 bg-black rounded-2xl overflow-hidden relative border border-white/10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none"></div>
          
          {/* Mock Video Placeholder */}
          <div className="text-center z-0 opacity-50">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <span className="text-4xl text-white font-playfair">S</span>
            </div>
            <p className="text-white font-bold tracking-widest uppercase text-xs">Waiting for Student...</p>
          </div>

          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
              <span className="text-white font-bold text-sm">Student</span>
              <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-500/20">Mic Muted</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area (Tutor controls + PIP) */}
        <div className="w-full md:w-72 flex flex-col gap-4">
          {/* Local Video (Tutor) */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-white/10 flex items-center justify-center shadow-lg">
            <div className="text-center opacity-30">
              <VideoOff size={32} className="mx-auto mb-2 text-white" />
              <p className="text-white text-xs font-bold uppercase tracking-widest">Camera Off</p>
            </div>
            <div className="absolute bottom-3 left-3 z-20">
              <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-white font-bold text-xs">You (Host)</span>
              </div>
            </div>
          </div>

          {/* Session Notes Panel */}
          <div className="flex-1 bg-[#1e293b] rounded-2xl border border-white/10 p-4 flex flex-col">
            <h3 className="text-white font-bold font-playfair mb-3">Session Notes</h3>
            <textarea 
              className="flex-1 bg-black/50 border border-white/5 rounded-xl p-3 text-sm text-white/80 outline-none focus:border-accent/50 resize-none placeholder-white/20"
              placeholder="Type your clinical observations here..."
            ></textarea>
            <button className="mt-3 w-full py-2 bg-accent/20 text-accent hover:bg-accent/30 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-colors border border-accent/20">
              Save Notes
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-24 bg-[#1e293b] border-t border-white/10 flex items-center justify-center gap-4 px-6 z-10">
        <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/5">
          <MicOff size={20} />
        </button>
        <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/5">
          <VideoOff size={20} />
        </button>
        <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/5">
          <MonitorUp size={20} />
        </button>
        
        <div className="w-px h-8 bg-white/10 mx-2"></div>

        <button className="w-16 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg shadow-red-500/20">
          <PhoneOff size={20} />
        </button>

        <div className="w-px h-8 bg-white/10 mx-2"></div>

        <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors border border-white/5">
          <MessageSquare size={20} />
        </button>
        <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors border border-white/5">
          <Focus size={20} />
        </button>
      </div>
    </div>
  );
}
