import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, ShoppingCart } from "lucide-react";
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

  // Check if student has credits in active packages
  const activePackages = await prisma.studentPackage.findMany({
    where: { studentId: session.user.id, status: "ACTIVE" }
  });
  
  const totalBalance = activePackages.reduce((acc, curr) => acc + curr.remainingSessions, 0);

  return (
    <div className="animate-in fade-in duration-700 font-sans w-full">
      {totalBalance > 0 ? (
        <div className="w-full -mt-6">
          <CalendlyWidget 
            url={tutor.calendlyConnection.schedulingUrl}
            prefillName={session.user.name || ""}
            prefillEmail={session.user.email || ""}
            tutorId={tutor.id}
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 p-8 border border-secondary/30 text-center max-w-2xl mx-auto mt-12">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-primary font-playfair mb-4">Insufficient Class Credits</h2>
          <p className="text-primary/70 mb-8 leading-relaxed">
            You don't have any class credits available. Please purchase a package to continue booking sessions with {tutor.name}.
          </p>
          <Link 
            href="/student/subscriptions" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all shadow-md group"
          >
            <ShoppingCart size={18} />
            View Packages
            <ArrowLeft size={18} className="group-hover:translate-x-1 transition-transform rotate-180 hidden" />
          </Link>
        </div>
      )}
    </div>
  );
}
