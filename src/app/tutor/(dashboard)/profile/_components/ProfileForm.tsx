"use client";

import { Save, User as UserIcon, Upload, Mail, Video, Film, ExternalLink, CheckCircle2, AlertCircle, Trash2, Play } from "lucide-react";
import { updateProfile } from "@/actions/user-actions";
import { toast } from "sonner";
import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getVideoEmbedInfo } from "@/lib/video-utils";

export default function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(user?.image || null);
  const [videoUrl, setVideoUrl] = useState<string>(user?.videoUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { update } = useSession();

  const videoInfo = getVideoEmbedInfo(videoUrl);

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
        toast.success("Profile updated successfully! Your public profile and video showcase are updated.");
        router.refresh();
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
              user?.name ? user.name[0].toUpperCase() : 'T'
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
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Display Name</label>
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

      <div className="space-y-2 group">
        <div className="flex justify-between items-end">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Teaching Headline</label>
        </div>
        <input 
          type="text" 
          name="teachingHeadline"
          defaultValue={user?.teachingHeadline || ""}
          placeholder="e.g. Expert in Accent Neutralization"
          className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white px-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
        />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2 group">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Languages Spoken</label>
          <input 
            type="text" 
            name="languages"
            defaultValue={user?.languages || ""}
            placeholder="e.g. English, Spanish"
            className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white px-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
          />
        </div>
        <div className="space-y-2 group">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Teaching Levels</label>
          <input 
            type="text" 
            name="teachingLevels"
            defaultValue={user?.teachingLevels || ""}
            placeholder="e.g. Beginner, Intermediate, Advanced"
            className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white px-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2 group">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Teaching Ages</label>
          <input 
            type="text" 
            name="teachingAges"
            defaultValue={user?.teachingAges || ""}
            placeholder="e.g. Adults, Children"
            className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white px-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
          />
        </div>
        <div className="space-y-2 group">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Teaching Style</label>
          <input 
            type="text" 
            name="teachingStyle"
            defaultValue={user?.teachingStyle || ""}
            placeholder="e.g. Interactive, Formal"
            className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white px-4 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm hover:bg-secondary/10"
          />
        </div>
      </div>

      <div className="space-y-2 group">
        <div className="flex justify-between items-end">
          <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Professional Bio</label>
          <span className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Supports formatting</span>
        </div>
        <textarea 
          rows={5}
          name="bio"
          defaultValue={user?.bio || ""}
          placeholder="I am a certified speech-language pathologist..."
          className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white p-5 text-sm font-medium text-primary outline-none transition-all resize-none rounded-2xl shadow-sm hover:bg-secondary/10 leading-relaxed"
        ></textarea>
      </div>

      <div className="space-y-2 group">
        <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Experience</label>
        <textarea 
          rows={4}
          name="experience"
          defaultValue={user?.experience || ""}
          placeholder="Detail your professional experience..."
          className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white p-5 text-sm font-medium text-primary outline-none transition-all resize-none rounded-2xl shadow-sm hover:bg-secondary/10 leading-relaxed"
        ></textarea>
      </div>

      <div className="space-y-2 group">
        <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1 group-focus-within:text-accent transition-colors">Qualifications</label>
        <textarea 
          rows={4}
          name="qualifications"
          defaultValue={user?.qualifications || ""}
          placeholder="List your degrees, certifications, etc."
          className="w-full bg-secondary/5 border-2 border-transparent focus:border-accent/20 focus:bg-white p-5 text-sm font-medium text-primary outline-none transition-all resize-none rounded-2xl shadow-sm hover:bg-secondary/10 leading-relaxed"
        ></textarea>
      </div>

      {/* Video Showcase Link Section */}
      <div className="space-y-5 p-6 sm:p-8 bg-gradient-to-br from-primary/[0.03] to-accent/[0.04] border border-secondary/40 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Film size={22} />
            </div>
            <div>
              <h4 className="text-base font-bold text-primary flex items-center gap-2">
                Tutor Profile Video Showcase Link
                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-accent/15 text-accent">
                  Featured on Profile
                </span>
              </h4>
              <p className="text-xs text-primary/60 font-medium">
                Add your own introduction video link to showcase your coaching style, articulation drills, and personality to prospective students.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {user?.id && (
              <Link
                href={`/mentors/${user.id}`}
                target="_blank"
                className="text-xs text-accent hover:underline font-bold flex items-center gap-1 transition-colors"
              >
                <span>Live Profile</span>
                <ExternalLink size={12} />
              </Link>
            )}
            {videoUrl && (
              <button
                type="button"
                onClick={() => setVideoUrl("")}
                className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} /> Clear Link
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-black text-primary/70 uppercase tracking-widest ml-1">
              Video Link (YouTube, Vimeo, Loom, or Direct MP4)
            </label>
            {videoUrl && (
              <span className="text-[11px] text-accent font-bold">
                {videoInfo.isValid ? `Recognized: ${videoInfo.type.toUpperCase()}` : 'Verifying link...'}
              </span>
            )}
          </div>
          <div className="relative">
            <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="url" 
              name="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/... or https://vimeo.com/..."
              className="w-full bg-white border-2 border-secondary/30 focus:border-accent/40 focus:bg-white pl-12 pr-10 py-3.5 text-sm font-medium text-primary outline-none transition-all rounded-2xl shadow-sm"
            />
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open video link in new tab"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary/40 hover:text-accent transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Supported Platforms Tag Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-primary/60 font-medium">
          <span className="font-bold text-primary/70 uppercase tracking-wider text-[10px]">Supported Formats:</span>
          <span className="px-2.5 py-1 bg-white border border-secondary/40 rounded-lg text-primary/80">YouTube (Videos & Shorts)</span>
          <span className="px-2.5 py-1 bg-white border border-secondary/40 rounded-lg text-primary/80">Vimeo</span>
          <span className="px-2.5 py-1 bg-white border border-secondary/40 rounded-lg text-primary/80">Loom</span>
          <span className="px-2.5 py-1 bg-white border border-secondary/40 rounded-lg text-primary/80">Direct MP4 / WebM</span>
        </div>

        {/* Live Video Preview Box */}
        <div className="mt-4 pt-4 border-t border-secondary/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <Play size={13} className="text-accent" />
              Live Student View Preview
            </span>
            {videoInfo.isValid && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={12} />
                Ready to Stream on Profile
              </span>
            )}
          </div>

          {videoInfo.isValid ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border border-secondary/40">
              {videoInfo.isIframe ? (
                <iframe
                  src={videoInfo.embedUrl}
                  title="Tutor Intro Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoInfo.embedUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ) : videoUrl ? (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0 text-amber-600" />
              <span>
                Please check your URL. Paste a valid full link like <code className="font-mono bg-white/70 px-1 py-0.5 rounded">https://youtube.com/watch?v=...</code>, <code className="font-mono bg-white/70 px-1 py-0.5 rounded">https://youtu.be/...</code>, <code className="font-mono bg-white/70 px-1 py-0.5 rounded">https://vimeo.com/...</code> or direct video.
              </span>
            </div>
          ) : (
            <div className="border-2 border-dashed border-secondary/50 rounded-2xl p-8 text-center bg-white/50">
              <div className="w-12 h-12 rounded-2xl bg-secondary/30 text-primary/40 flex items-center justify-center mx-auto mb-3">
                <Video size={22} />
              </div>
              <p className="text-sm font-bold text-primary/70 mb-1">No Introduction Video Added Yet</p>
              <p className="text-xs text-primary/50 max-w-sm mx-auto">
                Paste your YouTube, Vimeo, Loom or MP4 URL above to preview how your video showcase will look to students on your profile.
              </p>
            </div>
          )}
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
