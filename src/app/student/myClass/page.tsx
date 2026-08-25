import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Calendar, Video, Clock, ArrowRight, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'My Class | HD Clarity Speech',
};

export default async function MyClassPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Fetch upcoming sessions for this student
  const upcomingSessions = await prisma.session.findMany({
    where: {
      studentId: session.user.id,
      status: 'SCHEDULED',
      scheduledAt: {
        gte: new Date(),
      }
    },
    include: {
      tutor: true,
      booking: {
        include: {
          sessionType: true
        }
      }
    },
    orderBy: {
      scheduledAt: 'asc'
    },
    take: 3
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary font-playfair tracking-tight mb-2">My Class</h1>
        <p className="text-primary/60">Manage your active classes and schedule new ones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Actions & Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-accent/10 rounded-3xl p-8 border border-accent/20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/40 mb-6">
              <Video size={32} />
            </div>
            <h2 className="text-2xl font-black text-primary font-playfair mb-3">Ready to learn?</h2>
            <p className="text-primary/70 text-sm mb-8 leading-relaxed">
              Book a new 1-on-1 session with your preferred mentor to continue your journey.
            </p>
            <Link 
              href="/student/book" 
              className="w-full flex items-center justify-center gap-2 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all shadow-md group"
            >
              Book a Session
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-secondary/30 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-accent" size={20} />
              <h3 className="font-bold text-primary">Class Materials</h3>
            </div>
            <p className="text-sm text-primary/60">Your tutor will share specialized materials and exercises here after your sessions.</p>
          </div>
        </div>

        {/* Right Column: Upcoming Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 border border-secondary/30 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Calendar className="text-accent" size={20} />
                Upcoming Classes
              </h2>
              <Link href="/student/appointments" className="text-xs font-bold text-accent uppercase tracking-widest hover:text-primary transition-colors">
                View All
              </Link>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-secondary/30 rounded-2xl hover:border-accent/50 transition-colors">
                    <div className="flex-shrink-0 text-center sm:text-left min-w-[120px]">
                      <div className="text-xs font-bold text-accent uppercase tracking-widest mb-1">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date(s.scheduledAt))}
                      </div>
                      <div className="text-xl font-black text-primary font-playfair">
                        {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(s.scheduledAt))}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold text-primary text-lg">{s.booking.sessionType.name}</h4>
                      <p className="text-sm text-primary/60">with {s.tutor.name || 'Tutor'}</p>
                    </div>

                    <div className="flex-shrink-0 w-full sm:w-auto">
                      {s.meetingUrl ? (
                        <a 
                          href={s.meetingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full text-center px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-accent transition-colors shadow-sm"
                        >
                          Join Class
                        </a>
                      ) : (
                        <span className="block w-full text-center px-6 py-2.5 bg-secondary/30 text-primary/50 text-xs font-bold uppercase tracking-widest rounded-xl">
                          Link Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-secondary/50 rounded-2xl">
                <Calendar className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">No Upcoming Classes</h3>
                <p className="text-primary/60 text-sm mb-6 max-w-sm mx-auto">
                  You don't have any scheduled sessions right now. Book a class to get started!
                </p>
                <Link 
                  href="/student/book" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-secondary text-primary font-bold uppercase tracking-widest text-xs rounded-xl hover:border-primary transition-colors"
                >
                  Schedule Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
