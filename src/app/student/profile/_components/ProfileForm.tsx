"use client";

import { Save, User as UserIcon, Upload, Mail } from "lucide-react";
import { updateProfile } from "@/actions/user-actions";
import { toast } from "sonner";
import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(user?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { update } = useSession();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error("File is too large. Max size is 800KB.");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateProfile(formData);
        await update();
        toast.success("Profile updated successfully!");
        router.push("/student");
      } catch (error: any) {
        toast.error(error.message || "Failed to update profile");
      }
    });
  };

  return (
    <form action={handleSubmit} className="bg-white border border-secondary/20 p-8 sm:p-10 rounded-3xl shadow-xl shadow-primary/5 space-y-10 relative overflow-hidden z-0">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-secondary/30">
        <div className="flex items-center gap-6">
          <div 
            className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center text-primary font-black font-playfair text-4xl sm:text-5xl rounded-3xl shadow-inner border border-white/50 relative group cursor-pointer overflow-hidden transition-transform hover:scale-105 duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <Image src={preview} alt="Profile" fill className="object-cover" />
            ) : (
              user?.name ? user.name[0].toUpperCase() : 'S'
            )}
            <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-10">
              <Upload size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary mb-1">Profile Picture</h4>
            <p className="text-xs text-primary/50 font-bold uppercase tracking-widest mb-3">JPG, GIF or PNG. Max 800K</p>
            <input 
              type="file" 
              name="image" 
              accept="image/png, image/jpeg, image/gif" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2 bg-secondary/10 hover:bg-primary hover:text-white border border-secondary/50 hover:border-primary text-primary font-bold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 shadow-sm flex items-center gap-2"
            >
              Choose File
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2 group">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-accent transition-colors" size={18} />
            <input 
              type="text" 
              name="name"
              defaultValue={user?.name || ""}
              required
              className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white pl-12 pr-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
            />
          </div>
        </div>
        <div className="space-y-2 group">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-accent transition-colors" size={18} />
            <input 
              type="email" 
              name="email"
              defaultValue={user?.email || ""}
              required
              className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white pl-12 pr-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2 group">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            defaultValue={user?.phone || ""}
            className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white px-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
          />
        </div>
        <div className="space-y-2 group">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Timezone</label>
          <input 
            type="text" 
            name="timezone"
            defaultValue={user?.timezone || ""}
            placeholder="e.g. EST, GMT+1"
            className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white px-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-secondary/30 flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="px-10 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-widest text-sm transition-all duration-300 rounded-2xl flex items-center gap-3 w-full sm:w-auto justify-center shadow-xl shadow-accent/20 hover:shadow-primary/30 hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Save size={18} />
          {isPending ? "Saving Changes..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
