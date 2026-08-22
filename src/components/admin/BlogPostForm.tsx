"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBlogPost, updateBlogPost } from "@/actions/blog-actions";
import { ArrowLeft, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useRef } from "react";

const CKEditor = dynamic(() => import('./CKEditorWrapper'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-secondary/5 rounded-xl border border-secondary/50 animate-pulse flex items-center justify-center text-primary/40 font-bold uppercase tracking-widest text-xs">Loading Editor...</div>
});

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string | null;
  published: boolean;
};

export default function BlogPostForm({ initialData }: { initialData?: BlogPost | null }) {
  const router = useRouter();
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      
      const data = await res.json();
      setCoverImageUrl(data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.push("/admin/blog")}
          className="p-2.5 rounded-full bg-white border border-secondary/30 hover:bg-secondary/10 hover:text-accent transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">
            {initialData ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-primary/70 mt-2 font-sans text-base">
            {initialData ? "Update the content and settings of this post." : "Create a new article for your blog."}
          </p>
        </div>
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl shadow-sm p-6 sm:p-10">
        <form 
          action={async (formData) => {
            try {
              if (initialData) {
                await updateBlogPost(initialData.id, formData);
                toast.success("Post updated successfully!");
              } else {
                await createBlogPost(formData);
                toast.success("Post created successfully!");
              }
              router.push("/admin/blog");
            } catch (error) {
              toast.error("An error occurred while saving.");
            }
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Title</label>
              <input 
                type="text" 
                name="title"
                defaultValue={initialData?.title || ""}
                required
                onChange={(e) => {
                  if (!initialData) {
                    const slugInput = document.getElementById("slug-input") as HTMLInputElement;
                    if (slugInput) slugInput.value = generateSlug(e.target.value);
                  }
                }}
                className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">URL Slug</label>
              <input 
                id="slug-input"
                type="text" 
                name="slug"
                defaultValue={initialData?.slug || ""}
                required
                className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Excerpt (Summary)</label>
              <textarea 
                name="excerpt"
                defaultValue={initialData?.excerpt || ""}
                rows={4}
                className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Cover Image URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                  <input 
                    type="text" 
                    name="coverImage"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-secondary/5 border border-secondary/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
                  />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded-xl text-primary flex items-center justify-center transition-colors disabled:opacity-50"
                  title="Upload from computer"
                >
                  {isUploading ? <span className="animate-pulse">...</span> : <Upload size={18} />}
                </button>
              </div>
              {coverImageUrl && (
                <div className="mt-3 relative h-24 w-full rounded-xl overflow-hidden border border-secondary/30 bg-secondary/10 flex items-center justify-center">
                  <img src={coverImageUrl} alt="Cover Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Content</label>
            {/* Hidden input to pass content to formData */}
            <input type="hidden" name="content" value={content} />
            <CKEditor value={content} onChange={setContent} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Tags (Comma separated)</label>
              <input 
                type="text" 
                name="tags"
                defaultValue={initialData?.tags || ""}
                className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Status</label>
              <select 
                name="published"
                defaultValue={initialData?.published ? "true" : "false"}
                className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white appearance-none cursor-pointer"
              >
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8 border-t border-secondary/20">
            <button 
              type="button" 
              onClick={() => router.push("/admin/blog")}
              className="px-6 py-3.5 border border-secondary/40 text-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-secondary/20 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-3.5 bg-accent hover:bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
              {initialData ? "Save Changes" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
