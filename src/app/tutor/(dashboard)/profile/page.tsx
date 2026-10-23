import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/ProfileForm";
import Link from "next/link";
import { ExternalLink, Film, CheckCircle2 } from "lucide-react";

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
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-playfair drop-shadow-sm">My Profile</h1>
            <p className="text-secondary mt-3 font-sans text-lg sm:text-xl font-medium max-w-lg">
              Manage your public presence, teaching specialties, and video showcase.
            </p>
          </div>
          {user?.id && (
            <Link
              href={`/mentors/${user.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary hover:bg-accent hover:text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 shrink-0"
            >
              <span>View Public Profile</span>
              <ExternalLink size={14} />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-secondary/30 shadow-xl shadow-primary/5 lg:sticky lg:top-28 space-y-6">
            <div>
              <h3 className="text-2xl font-black text-primary font-playfair tracking-tight mb-3">Public Profile</h3>
              <p className="text-sm text-primary/60 font-sans leading-relaxed">
                This information is prominently displayed on your public tutor profile. Ensure your photo is professional and your bio highlights your unique coaching approach.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-primary/[0.04] to-accent/[0.06] rounded-2xl border border-secondary/40 space-y-3">
              <div className="flex items-center gap-2.5 text-accent font-bold text-xs uppercase tracking-wider">
                <Film size={16} />
                <span>Video Showcase</span>
              </div>
              <p className="text-xs text-primary/70 leading-relaxed">
                Add your own YouTube, Vimeo, Loom or MP4 video link. It appears at the bottom of your public profile so students can hear your articulation and coaching style.
              </p>
              {user?.id && (
                <Link
                  href={`/mentors/${user.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline pt-1"
                >
                  <CheckCircle2 size={13} />
                  <span>Preview Live Profile</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
