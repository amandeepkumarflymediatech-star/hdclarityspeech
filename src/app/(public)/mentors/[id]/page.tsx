import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { 
  Star, 
  CheckCircle2, 
  Languages, 
  Clock, 
  ArrowLeft, 
  Globe, 
  Award, 
  BookOpen, 
  Sparkles, 
  UserCheck, 
  Layers, 
  Users, 
  Calendar,
  ArrowRight,
  Flame
} from 'lucide-react';
import type { Metadata } from 'next';
import TutorVideoShowcase from '@/components/tutor/TutorVideoShowcase';

type Props = {
  params: Promise<{ id: string }>;
};

function parseArrayField(val: string | null | undefined): string[] {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    if (typeof parsed === 'string') return [parsed.trim()];
  } catch {
    if (val.includes(',')) {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [val.trim()];
  }
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const mentor = await prisma.user.findUnique({
    where: { id: resolvedParams.id, role: 'TUTOR' },
  });

  if (!mentor) {
    return { title: 'Mentor Not Found | HD Clarity Speech' };
  }

  return {
    title: `${mentor.name} - Tutor Profile | HD Clarity Speech`,
    description: mentor.teachingHeadline || mentor.bio || 'Communication and speech expert.',
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
      specializations: {
        include: { specialization: true }
      },
      sessionTypes: {
        include: { sessionType: true }
      },
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

  const teachingStyles = parseArrayField(mentor.teachingStyle);
  const teachingLevels = parseArrayField(mentor.teachingLevels);
  const teachingAges = parseArrayField(mentor.teachingAges);

  const fallbackStyles = [
    'Conversational Coaching',
    'Pronunciation & Accent Neutralization',
    'Practical Speaking Exercises',
    'Executive Articulation Drills'
  ];

  const activeStyles = teachingStyles.length > 0 ? teachingStyles : fallbackStyles;

  return (
    <div className="w-full bg-[#F7F5F0] min-h-screen pt-32 pb-24 text-primary font-sans">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/mentors" 
            className="inline-flex items-center gap-2 text-primary/60 hover:text-accent font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors"
          >
            <ArrowLeft size={16} /> Back to Mentors
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-accent/20 rounded-full text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Accepting 1:1 Students This Month</span>
          </div>
        </div>

        {/* Profile Hero Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-primary/5 overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            
            {/* Tutor Image Section */}
            <div className="md:w-5/12 relative h-96 md:h-auto min-h-[380px] bg-secondary">
              {mentor.image ? (
                <Image 
                  src={mentor.image} 
                  alt={mentor.name || 'Tutor'} 
                  fill 
                  priority
                  className="object-cover mix-blend-multiply opacity-95 transition-all duration-700 hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-playfair text-8xl font-black">
                  {mentor.name?.charAt(0) || 'T'}
                </div>
              )}

              <div className="absolute top-4 left-4 bg-primary/90 text-white backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md text-xs font-bold uppercase tracking-wider">
                <UserCheck size={14} className="text-accent" />
                <span>Verified Coach</span>
              </div>
            </div>

            {/* Tutor Header Info Section */}
            <div className="md:w-7/12 p-8 sm:p-10 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="px-3 py-1 bg-accent/10 text-accent font-bold uppercase tracking-widest text-[11px] rounded-full">
                    HD Clarity Specialist
                  </div>
                  <div className="flex items-center gap-1 text-primary font-bold text-sm">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span>5.0</span>
                    <span className="text-primary/50 font-normal">
                      ({mentor.tutorReviews.length > 0 ? mentor.tutorReviews.length : '12'} reviews)
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary font-playfair tracking-tight mb-2">
                  {mentor.name}
                </h1>

                {mentor.teachingHeadline ? (
                  <p className="text-accent font-semibold text-base sm:text-lg mb-6">
                    {mentor.teachingHeadline}
                  </p>
                ) : (
                  <p className="text-accent font-semibold text-base sm:text-lg mb-6">
                    Executive Speech Coach & Articulation Specialist
                  </p>
                )}

                {/* Key Attributes List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-primary/70 mb-8 pt-4 border-t border-secondary/50 text-sm">
                  {mentor.languages && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-secondary flex items-center justify-center text-accent">
                        <Languages className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary/50">Languages</p>
                        <p className="font-bold text-primary text-sm">{mentor.languages}</p>
                      </div>
                    </div>
                  )}

                  {mentor.experience && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-secondary flex items-center justify-center text-accent">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary/50">Experience</p>
                        <p className="font-bold text-primary text-sm">{mentor.experience}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-secondary flex items-center justify-center text-accent">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary/50">Timezone</p>
                      <p className="font-bold text-primary text-sm">{mentor.timezone || 'Global / Flexible'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-secondary flex items-center justify-center text-accent">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary/50">Format</p>
                      <p className="font-bold text-primary text-sm">Live 1-on-1 Coaching</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-secondary/50">
                <Link 
                  href="/pricing"
                  className="flex-1 text-center py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-xl shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Book with {mentor.name?.split(' ')[0]}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link 
                  href="/pricing"
                  className="text-center py-4 px-6 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-xl"
                >
                  View Packages
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Main Column (2 cols) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* About / Bio Section */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-primary/5">
              <h2 className="text-2xl font-bold font-playfair text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                About {mentor.name}
              </h2>
              <div className="text-primary/80 font-sans leading-relaxed text-base space-y-4">
                {mentor.bio ? (
                  <p className="whitespace-pre-wrap">{mentor.bio}</p>
                ) : (
                  <p>
                    {mentor.name} is an elite communication strategist and speech coach at HD Clarity. 
                    Specializing in high-stakes presentations, voice placement, and accent clarity, their tailored 
                    methodology empowers executives, founders, and professionals to deliver their message with undeniable impact.
                  </p>
                )}
              </div>
            </div>

            {/* Teaching Methodology & Style */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-primary/5">
              <h3 className="text-xl font-bold font-playfair text-primary mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent" />
                Teaching Style & Methodology
              </h3>
              <p className="text-sm text-primary/70 mb-6 leading-relaxed">
                Every session is structured around real-world speaking drills, instant targeted feedback, and practical vocal ergonomics.
              </p>
              
              <div className="flex flex-wrap gap-2.5">
                {activeStyles.map((style, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-[#F7F5F0] border border-primary/10 text-primary font-bold text-xs rounded-xl flex items-center gap-2"
                  >
                    <CheckCircle2 size={14} className="text-accent" />
                    {style}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualifications & Background */}
            {(mentor.qualifications || mentor.experience) && (
              <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-primary/5">
                <h3 className="text-xl font-bold font-playfair text-primary mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Qualifications & Background
                </h3>
                <div className="text-primary/80 text-sm leading-relaxed space-y-3">
                  {mentor.qualifications && (
                    <div>
                      <p className="font-bold text-primary mb-1 uppercase tracking-wider text-xs">Credentials & Certifications</p>
                      <p className="whitespace-pre-wrap">{mentor.qualifications}</p>
                    </div>
                  )}
                  {mentor.experience && (
                    <div className="pt-3 border-t border-secondary/50">
                      <p className="font-bold text-primary mb-1 uppercase tracking-wider text-xs">Professional Track Record</p>
                      <p className="whitespace-pre-wrap">{mentor.experience}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column (1 col) */}
          <div className="space-y-8">
            
            {/* Target Audience & Levels */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-primary/5">
              <h3 className="text-lg font-bold font-playfair text-primary mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                Who Can Benefit
              </h3>

              {teachingAges.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-wider mb-2">Student Groups</p>
                  <div className="flex flex-wrap gap-2">
                    {teachingAges.map((age, i) => (
                      <span key={i} className="px-3 py-1 bg-secondary/60 text-primary text-xs font-semibold rounded-lg">
                        {age}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {teachingLevels.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-wider mb-2">Skill Levels</p>
                  <div className="flex flex-wrap gap-2">
                    {teachingLevels.map((lvl, i) => (
                      <span key={i} className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-lg">
                        {lvl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {teachingAges.length === 0 && teachingLevels.length === 0 && (
                <div className="space-y-2 text-xs text-primary/70">
                  <p>• Corporate Executives & Leaders</p>
                  <p>• Tech Leads & Presenters</p>
                  <p>• Non-Native English Speakers</p>
                  <p>• Job & Interview Candidates</p>
                </div>
              )}
            </div>

            {/* Specializations Card */}
            {mentor.specializations.length > 0 ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-primary/5">
                <h3 className="text-lg font-bold font-playfair text-primary mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" />
                  Areas of Focus
                </h3>
                <div className="space-y-3">
                  {mentor.specializations.map((spec) => (
                    <div key={spec.id} className="p-3 bg-[#F7F5F0] rounded-xl text-xs font-semibold text-primary">
                      {spec.specialization.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-primary/5">
                <h3 className="text-lg font-bold font-playfair text-primary mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" />
                  Core Specializations
                </h3>
                <div className="space-y-2 text-xs text-primary/80 font-medium">
                  <div className="p-2.5 bg-[#F7F5F0] rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-accent" />
                    <span>Executive Articulation & Projection</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F5F0] rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-accent" />
                    <span>Accent Softening & Clarity</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F5F0] rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-accent" />
                    <span>Public Speaking & Stage Presence</span>
                  </div>
                  <div className="p-2.5 bg-[#F7F5F0] rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-accent" />
                    <span>High-Stakes Meeting Negotiation</span>
                  </div>
                </div>
              </div>
            )}

            {/* Limited Availability Callout */}
            <div className="bg-primary text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 fill-current animate-pulse" />
                <span>Limited Slots</span>
              </div>
              <h4 className="text-xl font-bold font-playfair mb-2">Reserve Your 1:1 Coaching</h4>
              <p className="text-white/70 text-xs leading-relaxed mb-5">
                To guarantee rapid transformation, each tutor accepts a strictly limited number of clients per month.
              </p>
              <Link
                href="/pricing"
                className="w-full py-3 bg-accent text-white font-bold text-xs uppercase tracking-widest text-center block rounded-xl hover:bg-white hover:text-primary transition-colors shadow-md"
              >
                Claim Your Seat & Save 20%
              </Link>
            </div>

          </div>

        </div>

        {/* Student Reviews Section */}
        {mentor.tutorReviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-playfair text-primary mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-accent fill-current" />
              Student Reviews for {mentor.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentor.tutorReviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5">
                  <div className="flex text-accent mb-4">
                    {[...Array(review.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-primary mb-6 text-base font-sans font-medium leading-relaxed italic">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center font-bold text-base font-playfair shrink-0">
                      {review.student?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm font-sans">{review.student?.name || 'Verified Student'}</h4>
                      <p className="text-[10px] text-primary/50 font-sans uppercase tracking-wider">1:1 Coaching Graduate</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Showcase Section (At the End of the Profile) */}
        <TutorVideoShowcase 
          tutorName={mentor.name || 'Tutor'} 
          tutorId={mentor.id} 
          tutorImage={mentor.image}
          videoUrl={mentor.videoUrl}
          bio={mentor.bio}
        />

      </div>
    </div>
  );
}
