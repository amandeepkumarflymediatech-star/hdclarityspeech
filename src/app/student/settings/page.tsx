import { Save, User as UserIcon, Mail, Lock, Upload } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateProfile } from "@/actions/user-actions";

export default async function StudentSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  return (
    <form action={updateProfile} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Settings</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage your personal profile and account security.</p>
        </div>
        <button type="submit" className="px-8 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-colors rounded-none flex items-center gap-2 w-full sm:w-auto justify-center shadow-sm">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-2">Personal Information</h3>
          <p className="text-sm text-primary/70 font-sans">Update your basic profile details and profile picture.</p>
        </div>
        
        <div className="lg:col-span-2 bg-white border border-secondary p-8 shadow-sm space-y-8">
          
          <div className="flex items-center gap-6 pb-6 border-b border-secondary">
            <div className="w-24 h-24 bg-primary flex items-center justify-center text-white font-black font-playfair text-3xl">
              {user?.name ? user.name[0].toUpperCase() : 'S'}
            </div>
            <div>
              <button type="button" className="px-6 py-3 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors flex items-center gap-2">
                <Upload size={16} /> Change Avatar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 ml-4" size={18} />
                <input 
                  type="text" 
                  name="name"
                  defaultValue={user?.name || ""}
                  className="w-full bg-secondary/10 border-b-2 border-secondary pl-12 pr-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 ml-4" size={18} />
                <input 
                  type="email" 
                  name="email"
                  defaultValue={user?.email || ""}
                  className="w-full bg-secondary/10 border-b-2 border-secondary pl-12 pr-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-black text-primary font-playfair tracking-tight mb-2">Security</h3>
          <p className="text-sm text-primary/70 font-sans">Update your password to keep your account secure.</p>
        </div>
        
        <div className="lg:col-span-2 bg-white border border-secondary p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 ml-4" size={18} />
              <input 
                type="password" 
                name="currentPassword"
                placeholder="Enter current password"
                className="w-full bg-secondary/10 border-b-2 border-secondary pl-12 pr-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">New Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 ml-4" size={18} />
              <input 
                type="password" 
                name="newPassword"
                placeholder="Enter new password"
                className="w-full bg-secondary/10 border-b-2 border-secondary pl-12 pr-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

    </form>
  );
}
