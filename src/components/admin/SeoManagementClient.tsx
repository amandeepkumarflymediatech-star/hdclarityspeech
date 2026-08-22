"use client";

import { useState, useMemo } from "react";
import { SearchCode, Search, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { deleteSeo } from "@/actions/seo-actions";
import { toast } from "sonner";
import Link from "next/link";

type SeoMetadata = {
  id: string;
  pagePath: string;
  title: string;
  description: string | null;
  keywords: string | null;
  ogImage: string | null;
  updatedAt: Date;
};

export default function SeoManagementClient({ seoList }: { seoList: SeoMetadata[] }) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof SeoMetadata; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const processedSeo = useMemo(() => {
    let result = [...seoList];

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(s => 
        s.pagePath.toLowerCase().includes(lowerSearch) || 
        s.title.toLowerCase().includes(lowerSearch)
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
  }, [seoList, search, sortConfig]);

  const totalPages = Math.ceil(processedSeo.length / itemsPerPage);
  const paginatedSeo = processedSeo.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof SeoMetadata) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this SEO configuration?")) {
      await deleteSeo(id);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Global SEO</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage meta tags, titles, and open graph data per page.</p>
        </div>
        <Link 
          href="/admin/seo/new"
          className="px-8 py-3.5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} />
          New Metadata
        </Link>
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-secondary/30 bg-secondary/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by path or title..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-secondary/40 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent text-primary outline-none transition-all placeholder-primary/40 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-secondary/30 bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors w-1/4" onClick={() => handleSort('pagePath')}>
                  <div className="flex items-center gap-2">Path {sortConfig?.key === 'pagePath' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">Meta Title {sortConfig?.key === 'title' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('updatedAt')}>
                  <div className="flex items-center gap-2">Last Updated {sortConfig?.key === 'updatedAt' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSeo.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-primary/60 font-medium">No SEO metadata found.</td>
                </tr>
              )}
              {paginatedSeo.map((seo) => (
                <tr key={seo.id} className="border-b border-secondary/20 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <span className="font-mono text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">{seo.pagePath}</span>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-primary text-sm">{seo.title}</p>
                    <p className="text-xs text-primary/60 mt-1 line-clamp-1">{seo.description}</p>
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium">
                    {new Date(seo.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right relative flex justify-end gap-1">
                    <Link 
                      href={`/admin/seo/edit/${seo.id}`}
                      className="p-2 text-primary/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit SEO"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => {
                        toast("Are you sure you want to delete this SEO configuration?", {
                          action: { label: 'Confirm', onClick: () => handleDelete(seo.id) }
                        });
                      }}
                      className="p-2 text-primary/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Delete SEO"
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedSeo.length)} of {processedSeo.length}
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
