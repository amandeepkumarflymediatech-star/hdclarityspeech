"use client";

import { saveCalendlyUrl } from "@/actions/tutor-actions";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";

export default function SettingsForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const hasExistingConnection = !!user?.calendlyConnection?.schedulingUrl;
  const [isEditing, setIsEditing] = useState(!hasExistingConnection);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await saveCalendlyUrl(formData);
        toast.success("Settings saved successfully!");
        router.push("/tutor");
      } catch (error: any) {
        toast.error(error.message || "Failed to save settings");
      }
    });
  };

  return (
    <form action={handleSubmit} className="lg:col-span-2 lg:col-start-2 bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm space-y-6">
      <div className="border-b border-secondary/30 pb-4 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-black text-primary font-playfair tracking-tight">Calendly Integration</h3>
          <p className="text-xs text-primary/60 font-sans mt-1">Connect your Calendly scheduling page so students can book sessions with you directly.</p>
        </div>
        {!isEditing && (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60 hover:text-accent transition-colors bg-secondary/10 px-4 py-2 rounded-xl shrink-0"
          >
            <Edit2 size={14} /> Edit
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">Scheduling URL</label>
        <div className="relative">
          <input 
            type="url" 
            name="schedulingUrl"
            defaultValue={user?.calendlyConnection?.schedulingUrl || ""}
            placeholder="https://calendly.com/your-name"
            disabled={!isEditing}
            className="w-full bg-secondary/5 border border-secondary/40 px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-[10px] text-primary/40 mt-2 ml-1 font-bold">Paste your personal Calendly scheduling link here.</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-1">Personal Access Token</label>
        <div className="relative">
          <input 
            type="password" 
            name="accessToken"
            defaultValue={user?.calendlyConnection?.accessToken || ""}
            placeholder="eyJhb..."
            disabled={!isEditing}
            className="w-full bg-secondary/5 border border-secondary/40 px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-[10px] text-primary/40 mt-2 ml-1 font-bold">Required to automatically sync Google Meet links. Get this from your Calendly Integrations settings.</p>
      </div>

      {isEditing && (
        <div className="pt-2 flex justify-start gap-3">
          <button 
            type="submit" 
            disabled={isPending}
            className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest text-xs transition-all rounded-xl shadow-md shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Save Integration"}
          </button>
          {hasExistingConnection && (
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 bg-secondary/10 hover:bg-secondary/20 text-primary font-bold uppercase tracking-widest text-xs transition-all rounded-xl"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </form>
  );
}
