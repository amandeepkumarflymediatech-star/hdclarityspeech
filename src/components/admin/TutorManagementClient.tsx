"use client";

import { useState, useMemo } from "react";
import { GraduationCap, Search, CheckCircle, XCircle, ArrowUpDown, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { approveTutor } from "@/actions/admin-actions";
import { toast } from "sonner";

type Tutor = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  isApproved: boolean;
};

export default function TutorManagementClient({ tutors }: { tutors: Tutor[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tutor; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const processedTutors = useMemo(() => {
    let result = [...tutors];

    if (statusFilter !== "ALL") {
      const approved = statusFilter === "APPROVED";
      result = result.filter(t => t.isApproved === approved);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(t => 
        (t.name?.toLowerCase() || "").includes(lowerSearch) || 
        t.email.toLowerCase().includes(lowerSearch)
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
  }, [tutors, search, statusFilter, sortConfig]);

  const totalPages = Math.ceil(processedTutors.length / itemsPerPage);
  const paginatedTutors = processedTutors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof Tutor) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleApproval = async (id: string, isApproved: boolean) => {
    try {
      await approveTutor(id, isApproved);
      toast.success(isApproved ? "Tutor approved successfully!" : "Tutor approval revoked.");
    } catch (error) {
      toast.error("Failed to update tutor status.");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between items-start border-b border-secondary/50 pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Tutor Applications</h1>
        <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Review and manage tutor onboarding and approvals.</p>
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-secondary/30 bg-secondary/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search tutors by name or email..." 
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
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-secondary/30 bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Tutor {sortConfig?.key === 'name' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">Applied On {sortConfig?.key === 'createdAt' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('isApproved')}>
                  <div className="flex items-center gap-2">Status {sortConfig?.key === 'isApproved' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTutors.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-primary/60 font-medium">No tutors found.</td>
                </tr>
              )}
              {paginatedTutors.map((tutor) => (
                <tr key={tutor.id} className="border-b border-secondary/20 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-primary text-sm sm:text-base">{tutor.name || 'Unknown User'}</p>
                    <p className="text-sm text-primary/60">{tutor.email}</p>
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium">
                    {new Date(tutor.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6">
                    {tutor.isApproved ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-1.5 w-fit">
                        <CheckCircle size={14} /> Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200 rounded-lg px-3 py-1.5 w-fit">
                        <GraduationCap size={14} /> Pending Review
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-right relative">
                    {!tutor.isApproved ? (
                      <button 
                        onClick={() => {
                          toast("Are you sure you want to approve this tutor?", {
                            action: { label: 'Confirm', onClick: () => handleApproval(tutor.id, true) }
                          });
                        }}
                        className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          toast("Are you sure you want to revoke approval?", {
                            action: { label: 'Confirm', onClick: () => handleApproval(tutor.id, false) }
                          });
                        }}
                        className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t border-secondary/30 bg-secondary/5 flex items-center justify-between">
            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedTutors.length)} of {processedTutors.length}
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
