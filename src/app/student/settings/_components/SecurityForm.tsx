"use client";

import { Lock } from "lucide-react";
import { updateSecurity } from "@/actions/user-actions";
import { toast } from "sonner";
import { useTransition, useRef } from "react";

export default function SecurityForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateSecurity(formData);
        toast.success("Password updated successfully!"); 
        formRef.current?.reset();
      } catch (error: any) {
        toast.error(error.message || "Failed to update password");
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              required
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
              required
              placeholder="Enter new password"
              className="w-full bg-secondary/5 border border-secondary/40 pl-12 pr-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-xl hover:bg-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider text-sm transition-all rounded-2xl flex items-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Lock size={18} /> {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </form>
  );
}
