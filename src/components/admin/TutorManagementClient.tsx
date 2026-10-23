"use client";

import { useState, useMemo } from "react";
import { GraduationCap, Search, CheckCircle, XCircle, ArrowUpDown, ChevronLeft, ChevronRight, Filter, Film, ExternalLink, Video, Save, Play } from "lucide-react";
import { approveTutor, updateTutorVideoUrl } from "@/actions/admin-actions";
import { toast } from "sonner";
import Link from "next/link";
import { getVideoEmbedInfo } from "@/lib/video-utils";

type Tutor = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  isApproved: boolean;
  experience?: string | null;
  bio?: string | null;
  qualifications?: string | null;
  videoUrl?: string | null;
};

export default function TutorManagementClient({ tutors }: { tutors: Tutor[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tutor; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [adminVideoUrl, setAdminVideoUrl] = useState<string>("");
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const itemsPerPage = 10;

  const handleOpenTutor = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setAdminVideoUrl(tutor.videoUrl || "");
  };

  const handleSaveVideo = async () => {
    if (!selectedTutor) return;
    setIsSavingVideo(true);
    try {
      await updateTutorVideoUrl(selectedTutor.id, adminVideoUrl);
      setSelectedTutor({ ...selectedTutor, videoUrl: adminVideoUrl.trim() || null });
      toast.success("Tutor video link updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update video link");
    } finally {
      setIsSavingVideo(false);
    }
  };

  const videoInfo = getVideoEmbedInfo(adminVideoUrl);

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
        if (aValue === null || aValue === undefined) aValue = "";
        if (bValue === null || bValue === undefined) bValue = "";
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
                  <td className="p-6 text-right relative space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => handleOpenTutor(tutor)}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary/70 bg-secondary/10 hover:bg-secondary/30 border border-secondary/50 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
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

      {selectedTutor && (
        <div className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary/30 max-w-2xl w-full p-8 relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedTutor(null)}
              className="absolute top-6 right-6 p-2 bg-secondary/20 hover:bg-secondary/40 text-primary rounded-full transition-colors"
            >
              <XCircle size={20} />
            </button>
            <div className="flex items-center justify-between gap-4 mb-6 pr-10">
              <h2 className="text-2xl font-black text-primary font-playfair">Tutor Details</h2>
              <Link
                href={`/mentors/${selectedTutor.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline bg-accent/10 px-3 py-1.5 rounded-xl border border-accent/20"
              >
                <span>View Public Profile</span>
                <ExternalLink size={13} />
              </Link>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Name</p>
                <p className="text-primary font-medium text-base">{selectedTutor.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Email</p>
                <p className="text-primary font-medium">{selectedTutor.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Experience</p>
                <p className="text-primary font-medium">{selectedTutor.experience || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Bio / Why join?</p>
                <p className="text-primary font-medium whitespace-pre-wrap">{selectedTutor.bio || 'Not provided'}</p>
              </div>
              {selectedTutor.qualifications && selectedTutor.qualifications.startsWith('CV: ') && (
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Resume / CV</p>
                  <a 
                    href={selectedTutor.qualifications.replace('CV: ', '')} 
                    target="_blank"
                    className="inline-block mt-1 px-4 py-2 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary transition-colors"
                  >
                    Download CV
                  </a>
                </div>
              )}

              {/* Video Showcase Section in Admin */}
              <div className="pt-4 border-t border-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Film size={14} className="text-accent" /> Tutor Video Showcase Link
                  </p>
                  {selectedTutor.videoUrl && (
                    <a 
                      href={selectedTutor.videoUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <Play size={12} /> Test Link
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                    <input 
                      type="url"
                      value={adminVideoUrl}
                      onChange={(e) => setAdminVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                      className="w-full bg-secondary/5 border border-secondary/40 rounded-xl pl-10 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-accent focus:border-accent text-primary outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveVideo}
                    disabled={isSavingVideo}
                    className="px-4 py-2 bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save size={13} />
                    <span>{isSavingVideo ? "Saving..." : "Save Link"}</span>
                  </button>
                </div>
                {videoInfo.isValid && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1.5">
                    Format Recognized: {videoInfo.type.toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
