import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CalendlyWidget from "@/components/student/CalendlyWidget";

export default async function TutorBookingPage({ params }: { params: Promise<{ tutorId: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const awaitedParams = await params;

  const tutor = await prisma.user.findUnique({
    where: { id: awaitedParams.tutorId, role: "TUTOR" },
    include: { calendlyConnection: true }
  });

  if (!tutor || !tutor.calendlyConnection?.schedulingUrl) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans max-w-4xl mx-auto">
      
      <div>
        <Link href="/student/book" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary/60 hover:text-accent transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Tutors
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Book with {tutor.name}</h1>
        <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Select a time that works best for your schedule.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 p-4 sm:p-8 border border-secondary/30">
        <CalendlyWidget 
          url={tutor.calendlyConnection.schedulingUrl}
          prefillName={session.user.name || ""}
          prefillEmail={session.user.email || ""}
          tutorId={tutor.id}
        />
      </div>

    </div>
  );
}
