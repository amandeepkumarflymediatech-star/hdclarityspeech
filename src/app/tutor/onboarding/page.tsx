import React from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2 } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import OnboardingForm from './_components/OnboardingForm';

export default async function TutorOnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'TUTOR') {
    redirect('/login');
  }

  // Fetch the latest user data to see if they completed onboarding
  const dbUser = (await prisma.user.findUnique({
    where: { id: session.user.id }
  })) as any;

  if (!dbUser) {
    redirect('/login');
  }

  // If already approved, redirect to dashboard
  if (dbUser.isApproved || dbUser.onboardingStatus === 'APPROVED') {
    redirect('/tutor');
  }

  // Map database JSON strings back to arrays for the form
  const parseJsonArray = (val: string | null) => {
    if (!val) return [];
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  };

  const initialData = {
    name: dbUser.name || '',
    email: dbUser.email || '',
    phone: dbUser.phone || '',
    timezone: dbUser.timezone || '',
    bio: dbUser.bio || '',
    experience: dbUser.experience || '',
    qualifications: dbUser.qualifications || '',
    languages: dbUser.languages || '',
    teachingHeadline: dbUser.teachingHeadline || '',
    teachingLevels: parseJsonArray(dbUser.teachingLevels),
    teachingAges: parseJsonArray(dbUser.teachingAges),
    teachingStyle: parseJsonArray(dbUser.teachingStyle),
    calendlyUrl: dbUser.calendlyUrl || '',
  };

  const isPendingReview = dbUser.onboardingStatus === 'UNDER_REVIEW';

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-6 py-12">
      {isPendingReview ? (
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center border border-primary/5">
          <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="w-12 h-12" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-primary font-playfair mb-4 tracking-tight">
            Application Pending
          </h1>
          
          <p className="text-lg text-primary/70 font-sans leading-relaxed mb-8">
            Thank you for applying to be a mentor at HD Clarity Speech. Your application has been received and is currently under review by our administration team.
          </p>

          <div className="bg-secondary/50 rounded-2xl p-6 text-left mb-10 border border-secondary">
            <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" /> What happens next?
            </h3>
            <ul className="space-y-3 text-sm text-primary/80 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                We will review your profile and qualifications.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                You may be contacted for a brief interview or additional details.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">•</span>
                Once approved, you will receive an email and can access your dashboard.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="inline-block py-4 px-10 bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-accent transition-colors rounded-xl shadow-lg"
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <OnboardingForm initialData={initialData} />
      )}
    </div>
  );
}
