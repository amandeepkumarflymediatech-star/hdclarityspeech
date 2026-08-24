import React from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, Languages, Clock } from 'lucide-react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Meet Your Tutors | HD Clarity Speech',
  description: 'Connect with expert communication and public speaking coaches tailored to your needs.',
};

export default async function MentorsPage() {
  const session = await getServerSession(authOptions);

  const getBookingLink = (mentorId: string) => {
    if (!session) return '/login';
    if (session.user.role === 'STUDENT') return `/student`;
    if (session.user.role === 'TUTOR') return '/tutor';
    if (session.user.role === 'ADMIN') return '/admin';
    return '/login';
  };

  const getButtonText = () => {
    if (!session) return 'Schedule Trial';
    if (session.user.role === 'STUDENT') return 'Book Session';
    if (session.user.role === 'TUTOR') return 'Go to Dashboard';
    if (session.user.role === 'ADMIN') return 'Go to Dashboard';
    return 'Schedule Trial';
  };

  // Fetch available mentors
  const mentors = await prisma.user.findMany({
    where: { 
      role: 'TUTOR',
      isApproved: true,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      experience: true,
      languages: true,
    }
  });

  // Fetch student reviews
  const reviews = await (prisma as any).review.findMany({
    where: { isActive: true },
    include: {
      student: { select: { name: true } },
      tutor: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="w-full bg-[#F7F5F0] pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm font-sans">Meet Your Tutor</h4> */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-primary font-playfair mb-6">
            Guidance from the <span className="text-accent italic font-cormorant">Best</span>
          </h1>
          <p className="text-lg md:text-xl text-primary/80 max-w-2xl mx-auto font-sans">
            Connect with our elite roster of communication specialists and start transforming your voice today.
          </p>
        </div>

        {/* Available Mentors Section */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
             <h2 className="text-3xl md:text-4xl font-bold font-playfair text-primary">Available Mentors</h2>
             <div className="h-px bg-secondary/50 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-primary/5 hover:-translate-y-2 transition-transform duration-300 group flex flex-col">
                <div className="relative h-64 bg-secondary w-full overflow-hidden">
                  {mentor.image ? (
                    <Image 
                      src={mentor.image} 
                      alt={mentor.name || 'Tutor'} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white font-playfair text-5xl font-black">
                      {mentor.name?.charAt(0) || 'T'}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="text-accent w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-primary">5.0</span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold font-playfair text-primary mb-2">{mentor.name}</h3>
                  
                  <div className="flex flex-col gap-3 mt-4 mb-6 text-sm text-primary/70 font-sans">
                    {mentor.languages && (
                      <div className="flex items-center gap-3">
                        <Languages className="w-4 h-4 text-accent shrink-0" />
                        <span>{mentor.languages}</span>
                      </div>
                    )}
                    {mentor.experience && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-accent shrink-0" />
                        <span>{mentor.experience}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-primary/80 font-sans text-sm line-clamp-3 leading-relaxed mb-8 flex-1">
                    {mentor.bio || 'Professional communication coach dedicated to helping you achieve clarity and confidence.'}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Link 
                      href={getBookingLink(mentor.id)} 
                      className="w-full block text-center py-3.5 bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-accent transition-colors rounded-xl shadow-sm"
                    >
                      {getButtonText()}
                    </Link>
                    <Link 
                      href={`/mentors/${mentor.id}`} 
                      className="w-full block text-center py-3.5 bg-transparent border-2 border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors rounded-xl"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {mentors.length === 0 && (
              <div className="col-span-full py-20 text-center text-primary/50">
                No mentors available at the moment. Please check back later.
              </div>
            )}
          </div>
        </div>

        {/* What Our Learners Say Section */}
        <div>
          <div className="flex items-center gap-4 mb-12">
             <div className="h-px bg-secondary/50 flex-1 hidden md:block"></div>
             <h2 className="text-3xl md:text-4xl font-bold font-playfair text-primary text-center">What Our Learners Say</h2>
             <div className="h-px bg-secondary/50 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-primary/5">
                <div className="flex text-accent mb-6">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                </div>
                <p className="text-primary mb-8 text-lg font-sans font-medium leading-relaxed italic">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-4 mt-auto border-t border-secondary/30 pt-6">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl font-playfair shrink-0">
                    {review.student?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary font-sans">{review.student?.name || 'Anonymous Student'}</h4>
                    {review.tutor && (
                      <p className="text-xs text-primary/50 font-bold font-sans uppercase tracking-wider mt-1">
                        Mentored by {review.tutor.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="col-span-full py-12 text-center text-primary/50">
                No reviews yet. Check back soon!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
