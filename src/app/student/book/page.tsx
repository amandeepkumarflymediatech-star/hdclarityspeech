import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, Calendar, ArrowRight } from "lucide-react";

export default async function StudentBookPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Find all tutors who have an active Calendly Connection
  const tutors = await prisma.user.findMany({
    where: { 
      role: "TUTOR",
      isActive: true,
      calendlyConnection: {
        isActive: true
      }
    },
    include: {
      calendlyConnection: true,
      specializations: { include: { specialization: true } }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Book a Session</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Select a specialized tutor to schedule your next therapy session.</p>
        </div>
      </div>

      {tutors.length === 0 ? (
        <div className="bg-white border border-secondary p-12 text-center shadow-sm">
          <Calendar size={48} className="mx-auto text-primary/30 mb-4" />
          <h3 className="text-xl font-bold text-primary font-playfair">No Tutors Available</h3>
          <p className="text-primary/60 mt-2">There are currently no tutors available for booking. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="bg-white border border-secondary p-6 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-secondary text-primary flex items-center justify-center font-black font-playfair text-2xl">
                  {tutor.name ? tutor.name[0].toUpperCase() : 'T'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{tutor.name || 'Tutor'}</h3>
                  <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">Speech Therapist</p>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm text-primary/70 line-clamp-3 mb-4">
                  {tutor.bio || "Experienced speech language pathologist dedicated to helping you achieve your communication goals."}
                </p>
              </div>

              <div className="pt-4 border-t border-secondary mt-auto">
                <Link href={`/student/book/${tutor.id}`} className="w-full py-3 bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-accent transition-colors flex justify-center items-center gap-2 group-hover:-translate-y-1">
                  View Availability <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
