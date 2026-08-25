import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/ProfileForm";

export default async function TutorProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TUTOR") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans max-w-6xl mx-auto pb-12">
      {/* Premium Header */}
      <div className="relative rounded-3xl overflow-hidden bg-primary p-10 sm:p-14 shadow-2xl shadow-primary/20 isolate">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 flex flex-col justify-between items-start">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-playfair drop-shadow-sm">My Profile</h1>
          <p className="text-secondary mt-3 font-sans text-lg sm:text-xl font-medium max-w-lg">Manage your public presence and showcase your expertise to students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-secondary/30 shadow-xl shadow-primary/5 lg:sticky lg:top-28">
            <h3 className="text-2xl font-black text-primary font-playfair tracking-tight mb-3">Public Profile</h3>
            <p className="text-sm text-primary/60 font-sans leading-relaxed">
              This information will be prominently displayed on your public tutor card. Ensure your photo is professional and your bio highlights your unique teaching style.
            </p>
          </div>
        </div>
        <div className="lg:col-span-8">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
