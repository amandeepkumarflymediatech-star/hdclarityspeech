"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSeo, updateSeo } from "@/actions/seo-actions";
import { ArrowLeft } from "lucide-react";

type SeoMetadata = {
  id: string;
  pagePath: string;
  title: string;
  description: string | null;
  keywords: string | null;
  ogImage: string | null;
};

export default function SeoMetadataForm({ initialData }: { initialData?: SeoMetadata | null }) {
  const router = useRouter();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.push("/admin/seo")}
          className="p-2.5 rounded-full bg-white border border-secondary/30 hover:bg-secondary/10 hover:text-accent transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">
            {initialData ? "Edit SEO Metadata" : "New SEO Metadata"}
          </h1>
          <p className="text-primary/70 mt-2 font-sans text-base">
            {initialData ? "Update meta tags for this page." : "Configure meta tags for a new page path."}
          </p>
        </div>
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl shadow-sm p-6 sm:p-10 max-w-3xl">
        <form 
          action={async (formData) => {
            try {
              if (initialData) {
                await updateSeo(initialData.id, formData);
                toast.success("Metadata updated successfully!");
              } else {
                await createSeo(formData);
                toast.success("Metadata created successfully!");
              }
              router.push("/admin/seo");
            } catch (error) {
              toast.error("An error occurred while saving.");
            }
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Page Path</label>
            <input 
              type="text" 
              name="pagePath"
              placeholder="e.g. /about or /contact"
              defaultValue={initialData?.pagePath || ""}
              required
              className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Meta Title</label>
            <input 
              type="text" 
              name="title"
              defaultValue={initialData?.title || ""}
              required
              className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Meta Description</label>
            <textarea 
              name="description"
              defaultValue={initialData?.description || ""}
              rows={4}
              className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Meta Keywords (Comma separated)</label>
            <input 
              type="text" 
              name="keywords"
              defaultValue={initialData?.keywords || ""}
              className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-8 border-t border-secondary/20">
            <button 
              type="button" 
              onClick={() => router.push("/admin/seo")}
              className="px-6 py-3.5 border border-secondary/40 text-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-secondary/20 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-3.5 bg-accent hover:bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
              {initialData ? "Save Changes" : "Create Metadata"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
