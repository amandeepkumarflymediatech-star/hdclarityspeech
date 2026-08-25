import React from 'react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Star, GraduationCap, MapPin, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'All Tutors | HD Clarity Speech',
};

export default async function AllTutorsPage() {
  const tutors = await prisma.user.findMany({
    where: {
      role: 'TUTOR',
      isApproved: true,
    },
    include: {
      specializations: {
        include: {
          specialization: true
        }
      }
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary font-playfair tracking-tight mb-2">Our Mentors</h1>
        <p className="text-primary/60">Find the perfect mentor to guide your speech journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-2xl p-6 border border-secondary/30 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-secondary/50 overflow-hidden relative flex-shrink-0 shadow-sm">
                {tutor.image ? (
                  <Image src={tutor.image} alt={tutor.name || 'Tutor'} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-black font-playfair uppercase">
                    {tutor.name?.charAt(0) || 'T'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-primary text-lg truncate flex items-center gap-1.5">
                  {tutor.name || 'Tutor'}
                  <CheckCircle2 size={14} className="text-accent" />
                </h3>
                <p className="text-xs text-primary/60 font-bold uppercase tracking-widest mt-0.5 truncate">
                  {tutor.teachingHeadline || 'Speech Therapist'}
                </p>
              </div>
            </div>

            <div className="flex-1 mb-6">
              <p className="text-sm text-primary/70 line-clamp-3 mb-4 leading-relaxed">
                {tutor.bio || 'An experienced mentor ready to help you achieve your goals.'}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {tutor.specializations.slice(0, 3).map((spec) => (
                  <span key={spec.specializationId} className="px-2.5 py-1 bg-secondary/20 text-primary/80 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {spec.specialization.name}
                  </span>
                ))}
                {tutor.specializations.length > 3 && (
                  <span className="px-2.5 py-1 bg-secondary/10 text-primary/60 text-[10px] font-bold rounded-lg">
                    +{tutor.specializations.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-secondary/20 flex gap-3">
              <Link href={`/student/book?tutorId=${tutor.id}`} className="flex-1 text-center py-2.5 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors">
                Book Session
              </Link>
            </div>
          </div>
        ))}

        {tutors.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-secondary/30">
            <GraduationCap className="w-12 h-12 text-primary/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-primary mb-2">No Tutors Found</h3>
            <p className="text-primary/60 text-sm">There are currently no approved tutors available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
