import { Save, User as UserIcon, Mail, Lock, Upload } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateProfile, updateSecurity } from "@/actions/user-actions";

export default async function StudentSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Settings</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage your personal profile and account security.</p>
        </div>
      </div>

      <form action={updateProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-2">Personal Information</h3>
          <p className="text-sm text-primary/60 font-sans">Update your basic profile details and profile picture.</p>
        </div>
        
        <div className="lg:col-span-2 bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm space-y-8">
          
          <div className="flex items-center gap-6 pb-6 border-b border-secondary/30">
            <div className="w-24 h-24 bg-primary/5 flex items-center justify-center text-primary font-black font-playfair text-3xl rounded-3xl shadow-sm border border-secondary/30">
              {user?.name ? user.name[0].toUpperCase() : 'S'}
            </div>
            <div>
              <button type="button" className="px-6 py-2.5 bg-secondary/10 border border-secondary/50 text-primary font-bold uppercase tracking-widest text-xs hover:bg-secondary/30 rounded-xl transition-colors flex items-center gap-2">
                <Upload size={16} /> Change Avatar
              </button>
              <p className="text-[10px] text-primary/40 mt-3 font-bold uppercase tracking-widest">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">Full Name</label>
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
            <div className="mt-6 flex justify-end">
              <button type="submit" className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl flex items-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1">
                <Save size={18} /> Save Profile
              </button>
            </div>
          </div>
      </form>

      <form action={updateSecurity} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-2">Security</h3>
          <p className="text-sm text-primary/60 font-sans">Update your password to keep your account secure.</p>
        </div>
        
        <div className="lg:col-span-2 bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input 
                type="password" 
                name="currentPassword"
                placeholder="Enter current password"
                className="w-full bg-secondary/5 border border-secondary/40 pl-12 pr-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-xl hover:bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
              <input 
                type="password" 
                name="newPassword"
                placeholder="Enter new password"
                className="w-full bg-secondary/5 border border-secondary/40 pl-12 pr-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-xl hover:bg-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl flex items-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1">
              <Lock size={18} /> Update Password
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}
