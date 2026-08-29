"use client";

import { useState, useMemo } from "react";
import { FileText, Search, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Check, X, Plus } from "lucide-react";
import { deleteBlogPost } from "@/actions/blog-actions";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  tags: string | null;
  published: boolean;
  createdAt: Date;
  author: { name: string | null; email: string };
};

export default function BlogManagementClient({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: keyof BlogPost; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const processedPosts = useMemo(() => {
    let result = [...posts];

    if (statusFilter !== "ALL") {
      const isPublished = statusFilter === "PUBLISHED";
      result = result.filter(p => p.published === isPublished);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerSearch) || 
        p.slug.toLowerCase().includes(lowerSearch)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (aValue === null) aValue = "";
        if (bValue === null) bValue = "";
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [posts, search, statusFilter, sortConfig]);

  const totalPages = Math.ceil(processedPosts.length / itemsPerPage);
  const paginatedPosts = processedPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof BlogPost) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Post?',
      text: 'Are you sure you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!'
    });

    if (result.isConfirmed) {
      await deleteBlogPost(id);
      toast.success("Post deleted");
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Blog Articles</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Create, edit, and publish platform content.</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="px-8 py-3.5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-secondary/30 bg-secondary/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-secondary/40 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent text-primary outline-none transition-all placeholder-primary/40 shadow-sm"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto items-center">
            <span className="text-sm font-bold text-primary/60 uppercase tracking-widest hidden sm:block">Filter:</span>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-auto px-4 py-3 bg-white border border-secondary/40 rounded-xl text-xs font-bold text-primary outline-none uppercase tracking-widest focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Posts</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-secondary/30 bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors w-1/3" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">Title {sortConfig?.key === 'title' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('published')}>
                  <div className="flex items-center gap-2">Status {sortConfig?.key === 'published' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Tags</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">Date {sortConfig?.key === 'createdAt' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-primary/60 font-medium">No posts found.</td>
                </tr>
              )}
              {paginatedPosts.map((post) => (
                <tr key={post.id} className="border-b border-secondary/20 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-primary text-sm sm:text-base">{post.title}</p>
                    <p className="text-xs text-primary/60 mt-1">/{post.slug}</p>
                  </td>
                  <td className="p-6">
                    {post.published ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-1.5 w-fit">
                        <Check size={14} /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary/60 bg-secondary/30 border border-secondary/50 rounded-lg px-3 py-1.5 w-fit">
                        <Edit size={14} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="p-6">
                     <span className="text-sm font-medium text-primary/70">{post.tags || "None"}</span>
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right relative flex justify-end gap-1">
                    <Link 
                      href={`/admin/blog/edit/${post.id}`}
                      className="p-2 text-primary/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-primary/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t border-secondary/30 bg-secondary/5 flex items-center justify-between">
            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedPosts.length)} of {processedPosts.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-secondary/40 bg-white text-primary hover:bg-secondary/10 disabled:opacity-50 transition-colors"><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-secondary/40 bg-white text-primary hover:bg-secondary/10 disabled:opacity-50 transition-colors"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
