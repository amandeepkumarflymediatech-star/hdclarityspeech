import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Star, CheckCircle2, Languages, Clock, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const mentor = await prisma.user.findUnique({
    where: { id: resolvedParams.id, role: 'TUTOR' },
  });

  if (!mentor) {
    return { title: 'Mentor Not Found' };
  }

  return {
    title: `${mentor.name} - HD Clarity Speech`,
    description: mentor.bio || 'Communication and speech expert.',
  };
}

export default async function MentorProfilePage({ params }: Props) {
  const resolvedParams = await params;

  const mentor = await prisma.user.findUnique({
    where: { 
      id: resolvedParams.id,
      role: 'TUTOR'
    },
    include: {
      tutorReviews: {
        where: { isActive: true },
        include: {
          student: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!mentor) {
    notFound();
  }

  return (
    <div className="w-full bg-[#F7F5F0] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Back Link */}
        <Link href="/mentors" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-sm tracking-wider uppercase mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Mentors
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-primary/5 overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            
            {/* Image Section */}
            <div className="md:w-1/3 relative h-80 md:h-auto bg-secondary">
              {mentor.image ? (
                <Image 
                  src={mentor.image} 
                  alt={mentor.name || 'Tutor'} 
                  fill 
                  className="object-cover mix-blend-multiply opacity-90 grayscale contrast-125 hover:grayscale-0 transition-all duration-700" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-playfair text-8xl font-black">
                  {mentor.name?.charAt(0) || 'T'}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="md:w-2/3 p-10 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-accent/10 text-accent font-bold uppercase tracking-widest text-xs rounded-full">
                  Verified Mentor
                </div>
                {mentor.tutorReviews.length > 0 && (
                  <div className="flex items-center gap-1 text-primary font-bold text-sm">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span>5.0</span>
                    <span className="text-primary/50 font-normal">({mentor.tutorReviews.length} reviews)</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-primary font-playfair mb-6 tracking-tight">
                {mentor.name}
              </h1>

              <div className="flex flex-col gap-4 text-primary/70 font-sans mb-10">
                {mentor.languages && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary/50">Languages</p>
                      <p className="font-medium text-primary">{mentor.languages}</p>
                    </div>
                  </div>
                )}
                {mentor.experience && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary/50">Experience</p>
                      <p className="font-medium text-primary">{mentor.experience}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-auto">
                <Link 
                  href="/login" 
                  className="flex-1 text-center py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-accent transition-colors shadow-lg"
                >
                  Schedule Trial
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-playfair text-primary mb-6">About {mentor.name?.split(' ')[0]}</h2>
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-primary/5 text-primary/80 font-sans leading-relaxed text-lg">
            {mentor.bio ? (
              <p>{mentor.bio}</p>
            ) : (
              <p>{mentor.name} is a dedicated communication professional focused on helping individuals master their delivery and lead with confidence. Their personalized approach guarantees immediate results.</p>
            )}
            
            {mentor.qualifications && (
              <div className="mt-8 pt-8 border-t border-secondary/50">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Qualifications</h3>
                <p>{mentor.qualifications}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {mentor.tutorReviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold font-playfair text-primary mb-6">Student Reviews</h2>
            <div className="grid grid-cols-1 gap-6">
              {mentor.tutorReviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-primary/5">
                  <div className="flex text-accent mb-4">
                    {[...Array(review.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-primary mb-6 text-lg font-sans font-medium leading-relaxed italic">
                    "{review.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center font-bold text-lg font-playfair shrink-0">
                      {review.student?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm font-sans">{review.student?.name || 'Anonymous Student'}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
