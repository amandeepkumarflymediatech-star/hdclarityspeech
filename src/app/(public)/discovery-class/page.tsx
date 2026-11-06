import React from 'react';
import { prisma } from '@/lib/db';
import { getDemoEligibility } from '@/actions/student-actions';
import DiscoveryClassBookingWidget from '@/components/student/DiscoveryClassBookingWidget';
import Link from 'next/link';
import { 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  LogIn, 
  UserPlus, 
  Award,
  ChevronRight
} from 'lucide-react';

export const metadata = {
  title: 'Free 1:1 Discovery Class | HD Clarity Speech',
  description: 'Book your complimentary 1-on-1 speech and communication discovery class with an elite coach. One free demo session per student.',
};

export default async function DiscoveryClassPage() {
  const eligibility = await getDemoEligibility();

  // Find active calendly connection
  const activeConnection = await prisma.calendlyConnection.findFirst({
    where: { isActive: true },
    include: { tutor: true }
  });

  const calendlyUrl = activeConnection?.schedulingUrl || process.env.NEXT_PUBLIC_CALENDLY_URL;
  const tutorId = activeConnection?.tutorId;

  const navigationLinks = (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 w-full pt-2">
      <Link 
        href="/mentors" 
        className="group inline-flex items-center justify-between sm:justify-start gap-2 text-primary font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-accent transition-colors py-1.5"
      >
        <span>Meet Our Tutors</span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all shrink-0">
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </Link>

      <Link 
        href="/pricing" 
        className="text-primary/70 hover:text-accent font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors py-1.5 text-center sm:text-left"
      >
        View Packages & Pricing
      </Link>
    </div>
  );

  return (
    <div className="w-full font-sans min-h-screen bg-[#F7F5F0] text-primary relative flex flex-col justify-start pt-36 sm:pt-40 md:pt-44 lg:pt-44 pb-28 sm:pb-32 overflow-x-hidden">
      
      {/* Background Accent Graphics */}
      <div className="absolute top-0 right-0 w-2/3 sm:w-1/2 lg:w-1/3 h-1/2 lg:h-full bg-accent/5 rounded-bl-[60px] sm:rounded-bl-[100px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-1/2 sm:w-1/3 lg:w-1/4 h-1/3 lg:h-1/2 bg-primary/5 rounded-tr-[60px] sm:rounded-tr-[100px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Responsive Layout Grid:
            - On Mobile: 1 column. Header & Pitch -> Action/Scheduler Card -> What's Included -> Links
            - On Tablet (md: 768px-1023px): 2 columns (5 cols / 7 cols). Pitch + Highlights on Left, Scheduler on Right
            - On Desktop (lg: 1024px+): 2 columns with sticky Left column
        */}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 lg:gap-12 xl:gap-16 items-start">
          
          {/* ================= LEFT COLUMN: The Pitch & Details ================= */}
          <div className="md:col-span-5 flex flex-col items-start text-left w-full md:sticky md:top-40">
            
          
            {/* Responsive Main Heading */}
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-3 sm:mb-5 text-primary font-playfair leading-[1.15] sm:leading-[1.1] break-words">
              Book Your Free <br className="hidden sm:inline md:hidden lg:inline"/>
              <span className="text-accent italic font-cormorant relative inline-block">
                Discovery Class
                <div className="absolute bottom-1 left-0 w-full h-1.5 sm:h-2.5 bg-accent/20 -z-10 transform -rotate-1"></div>
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-base lg:text-lg text-primary/80 leading-relaxed mb-4 sm:mb-6 font-medium">
              Experience our elite communication coaching firsthand. Get a personalized speech assessment, actionable diagnostic feedback, and a tailored growth roadmap—completely free.
            </p>

            {/* One-Time Limit Urgency Callout */}
            <div className="w-full mb-6 sm:mb-8 p-3 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 sm:gap-3">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-primary/80 leading-relaxed">
                <strong className="text-primary font-bold">Limited to 1 Discovery Class per student:</strong> Every learner is entitled to one complimentary session to experience our methodology before choosing a package.
              </div>
            </div>
            
            {/* Desktop & Tablet Links (Hidden on Mobile, shown in Left column on md+) */}
            <div className="hidden md:flex flex-col gap-4 w-full">
              {navigationLinks}
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Dynamic Action Card / Scheduler ================= */}
          <div className="md:col-span-7 w-full relative">
            
            {/* STATE 1: User is NOT logged in */}
            {!eligibility.isLoggedIn && (
              <div className="relative bg-white p-5 sm:p-7 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl md:rounded-[36px] shadow-xl border border-primary/10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/10 text-accent rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3">
                  100% Free • No Payment Required
                </div>

                <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black text-primary font-playfair tracking-tight mb-2 sm:mb-3">
                  Claim Your Free Discovery Class
                </h2>

                <p className="text-primary/70 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-7">
                  To link your scheduled class directly to your student dashboard and enforce our one-session limit, please sign in or create a free student account.
                </p>

                <div className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-7">
                  <Link
                    href="/student/login?callbackUrl=/discovery-class"
                    className="w-full flex items-center justify-center gap-2.5 sm:gap-3 py-3.5 sm:py-4 px-4 sm:px-6 bg-primary hover:bg-accent text-white font-bold rounded-xl sm:rounded-2xl uppercase tracking-wider text-xs sm:text-sm transition-all shadow-md group text-center"
                  >
                    <LogIn className="w-4 h-4 shrink-0" />
                    <span>Sign In to Schedule Class</span>
                    <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/student/signup?callbackUrl=/discovery-class"
                    className="w-full flex items-center justify-center gap-2.5 sm:gap-3 py-3.5 sm:py-4 px-4 sm:px-6 bg-secondary/30 hover:bg-secondary/60 text-primary font-bold rounded-xl sm:rounded-2xl uppercase tracking-wider text-xs sm:text-sm transition-all border border-secondary text-center"
                  >
                    <UserPlus className="w-4 h-4 text-accent shrink-0" />
                    <span>Create Free Student Account</span>
                  </Link>
                </div>

                <div className="pt-4 sm:pt-5 border-t border-secondary/40 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs text-primary/65">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                    No credit card needed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                    Takes 30 seconds
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    1 session per student
                  </span>
                </div>
              </div>
            )}

            {/* STATE 2: Logged in as NON-STUDENT (Tutor / Admin) */}
            {eligibility.isLoggedIn && eligibility.role !== 'STUDENT' && (
              <div className="relative bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[36px] shadow-xl border border-primary/10 text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-primary font-playfair tracking-tight mb-2 sm:mb-3">
                  {eligibility.role === 'ADMIN' ? 'Admin Portal' : 'Tutor Account'}
                </h2>
                <p className="text-primary/70 mb-6 max-w-md mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
                  You are currently signed in as a <span className="font-bold text-primary">{eligibility.role}</span>. Discovery classes are intended for prospective students.
                </p>
                <Link
                  href={eligibility.role === 'ADMIN' ? '/admin' : '/tutor'}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-primary hover:bg-accent text-white font-bold rounded-xl sm:rounded-2xl uppercase tracking-wider text-xs sm:text-sm transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            )}

            {/* STATE 3: Student already used / booked their free Discovery Class */}
            {eligibility.isLoggedIn && eligibility.role === 'STUDENT' && !eligibility.eligible && (
              <div className="relative bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[36px] shadow-xl border border-primary/10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                  Offer Claimed
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-primary font-playfair tracking-tight mb-2 sm:mb-3">
                  Discovery Class Already Claimed
                </h2>

                <p className="text-primary/70 text-xs sm:text-sm md:text-base max-w-lg mx-auto mb-6 leading-relaxed">
                  You have already scheduled or completed your complimentary 1:1 Discovery Class! Every student is eligible for one free session.
                </p>

                <div className="bg-[#F7F5F0] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-primary/10 mb-6 text-left max-w-lg mx-auto">
                  <h4 className="font-bold text-primary mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-accent shrink-0" />
                    <span>Ready to continue your speech transformation?</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-primary/70 leading-relaxed">
                    Choose from our coaching packages to book recurring sessions, unlock progress tracking, and work with dedicated speech coaches.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center w-full max-w-md mx-auto">
                  <Link
                    href="/student/appointments"
                    className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-primary hover:bg-accent text-white font-bold rounded-xl sm:rounded-2xl uppercase tracking-wider text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 text-center"
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>My Sessions</span>
                  </Link>

                  <Link
                    href="/pricing"
                    className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-accent hover:bg-primary text-white font-bold rounded-xl sm:rounded-2xl uppercase tracking-wider text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 text-center"
                  >
                    <span>View Packages</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              </div>
            )}

            {/* STATE 4: Student is LOGGED IN and ELIGIBLE to book their 1-time Discovery Class */}
            {eligibility.isLoggedIn && eligibility.role === 'STUDENT' && eligibility.eligible && (
              <div className="relative bg-white p-2.5 sm:p-4 md:p-5 lg:p-6 rounded-2xl sm:rounded-3xl md:rounded-[28px] lg:rounded-[36px] shadow-xl border border-primary/10 w-full transition-all duration-300">
                
                {/* Student Welcome Banner */}
                <div className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 mb-2.5 sm:mb-3 md:mb-4 rounded-xl sm:rounded-2xl bg-accent/10 border border-accent/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                    <span className="font-bold text-primary truncate max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-xs">
                      Logged in as {eligibility.user?.name || eligibility.user?.email}
                    </span>
                  </div>
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-accent uppercase tracking-wider shrink-0 bg-white/70 sm:bg-accent/15 px-2.5 py-1 rounded-full border border-accent/20 self-start sm:self-auto">
                    1 Free Class Available
                  </span>
                </div>

                <div className="bg-[#F7F5F0]/50 rounded-xl sm:rounded-2xl md:rounded-[20px] lg:rounded-[24px] overflow-hidden min-h-[560px] sm:min-h-[620px] md:min-h-[650px] lg:min-h-[700px] flex flex-col relative z-10 border border-primary/5 w-full">
                  {calendlyUrl ? (
                    <DiscoveryClassBookingWidget
                      calendlyUrl={calendlyUrl}
                      prefillName={eligibility.user?.name || ''}
                      prefillEmail={eligibility.user?.email || ''}
                      tutorId={tutorId}
                    />
                  ) : (
                    <div className="text-center py-12 sm:py-16 md:py-20 px-4 sm:px-8 text-primary my-auto">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-primary/10 shadow-lg">
                        <Calendar className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-accent" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-2 sm:mb-3 font-playfair tracking-tight">Scheduling is temporarily offline</h3>
                      <p className="text-primary/60 max-w-md mx-auto text-xs sm:text-sm md:text-base font-sans leading-relaxed mb-6">
                        Our coaches are currently in sessions. Please check back shortly or browse our tutor roster.
                      </p>
                      <Link 
                        href="/mentors" 
                        className="inline-block px-6 sm:px-8 py-3.5 bg-primary hover:bg-accent text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-xl transition-all shadow-md"
                      >
                        Browse Tutors
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Navigation Links (Shown below Action Card on Mobile only) */}
            <div className="flex md:hidden flex-col gap-4 mt-6 w-full">
              {navigationLinks}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
