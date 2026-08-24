import { Save, User as UserIcon, FileText, Upload, Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateProfile } from "@/actions/user-actions";

export default async function TutorSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TUTOR") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { calendlyConnection: true }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Settings</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage your tutor profile and availability preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-2">Public Profile</h3>
          <p className="text-sm text-primary/60 font-sans">This information will be visible to students browsing for tutors.</p>
        </div>
        
        <form action={updateProfile} className="lg:col-span-2 bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm space-y-8">
          
          <div className="flex justify-end">
            <button type="submit" className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1">
              <Save size={18} />
              Save Profile
            </button>
          </div>
          
          <div className="flex items-center gap-6 pb-6 border-b border-secondary/30">
            <div className="w-24 h-24 bg-primary/5 flex items-center justify-center text-primary font-black font-playfair text-3xl rounded-3xl shadow-sm border border-secondary/30">
              {user?.name ? user.name[0].toUpperCase() : 'T'}
            </div>
            <div>
              <button type="button" className="px-6 py-2.5 bg-secondary/10 border border-secondary/50 text-primary font-bold uppercase tracking-widest text-xs hover:bg-secondary/30 rounded-xl transition-colors flex items-center gap-2">
                <Upload size={16} /> Upload Photo
              </button>
              <p className="text-[10px] text-primary/40 mt-3 font-bold uppercase tracking-widest">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">Display Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input 
                  type="text" 
                  name="name"
                  defaultValue={user?.name || ""}
                  className="w-full bg-secondary/5 border border-secondary/40 pl-12 pr-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-xl hover:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input 
                  type="email" 
                  name="email"
                  defaultValue={user?.email || ""}
                  className="w-full bg-secondary/5 border border-secondary/40 pl-12 pr-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-xl hover:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">Bio</label>
            <textarea 
              rows={4}
              name="bio"
              defaultValue={user?.bio || "I am a certified speech-language pathologist with over 10 years of experience helping children and adults overcome articulation and fluency challenges."}
              className="w-full bg-secondary/5 border border-secondary/40 p-4 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all resize-none rounded-xl hover:bg-white"
            ></textarea>
          </div>
        </form>

        <form action={async (formData) => {
          "use server";
          const { saveCalendlyUrl } = await import("@/actions/tutor-actions");
          await saveCalendlyUrl(formData);
        }} className="lg:col-span-2 lg:col-start-2 bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="border-b border-secondary/30 pb-4">
            <h3 className="text-lg font-black text-primary font-playfair tracking-tight">Calendly Integration</h3>
            <p className="text-xs text-primary/60 font-sans mt-1">Connect your Calendly scheduling page so students can book sessions with you directly.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">Scheduling URL</label>
            <div className="relative">
              <input 
                type="url" 
                name="schedulingUrl"
                defaultValue={user?.calendlyConnection?.schedulingUrl || ""}
                placeholder="https://calendly.com/your-name"
                className="w-full bg-secondary/5 border border-secondary/40 px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-xl hover:bg-white"
              />
            </div>
            <p className="text-[10px] text-primary/40 mt-2 ml-1 font-bold">Paste your personal Calendly scheduling link here.</p>
          </div>

          <div className="pt-2">
            <button type="submit" className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest text-xs transition-all rounded-xl shadow-md shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5">
              Save Integration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
