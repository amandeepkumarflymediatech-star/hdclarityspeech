"use client";

import { useState, useMemo } from "react";
import { CreditCard, Download, Search, Check, X, Edit, Trash2, Plus, ArrowUpDown, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { createSubscription, updateSubscription, deleteSubscription } from "@/actions/admin-actions";
import { toast } from "sonner";
import Swal from "sweetalert2";

type Subscription = {
  id: string;
  userId: string;
  planType: string;
  status: string;
  createdAt: Date;
  user: { name: string | null; email: string } | null;
};

type User = {
  id: string;
  name: string | null;
  email: string;
};

export default function SubscriptionManagementClient({ subscriptions, users }: { subscriptions: Subscription[], users: User[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Subscription | 'user_name'; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  // Sorting, Filtering, Pagination logic
  const processedSubs = useMemo(() => {
    let result = [...subscriptions];

    // 1. Filter
    if (statusFilter !== "ALL") {
      result = result.filter(s => s.status === statusFilter);
    }

    // 2. Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(sub => 
        (sub.user?.name?.toLowerCase() || "").includes(lowerSearch) || 
        (sub.user?.email.toLowerCase() || "").includes(lowerSearch) ||
        sub.planType.toLowerCase().includes(lowerSearch)
      );
    }

    // 3. Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'user_name') {
          aValue = a.user?.name || a.user?.email || "";
          bValue = b.user?.name || b.user?.email || "";
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        
        if (aValue === null) aValue = "";
        if (bValue === null) bValue = "";

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [subscriptions, search, statusFilter, sortConfig]);

  const totalPages = Math.ceil(processedSubs.length / itemsPerPage);
  const paginatedSubs = processedSubs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof Subscription | 'user_name') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const openCreateModal = () => {
    setSelectedSub(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subscription) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Package?',
      text: 'Are you sure you want to delete this package?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!'
    });

    if (result.isConfirmed) {
      await deleteSubscription(id);
      toast.success("Package deleted successfully");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Packages</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage student packages and billing plans.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-8 py-3.5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} />
          New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Total Active', value: subscriptions.filter(s => s.status === 'ACTIVE').length.toString(), sub: 'Current Active Plans' },
          { title: 'Total Cancelled', value: subscriptions.filter(s => s.status === 'CANCELLED').length.toString(), sub: 'Past Subscriptions' },
          { title: 'Total Packages', value: subscriptions.length.toString(), sub: 'All Time' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-secondary/30 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-bold text-primary/60 uppercase tracking-widest">{stat.title}</h3>
            <p className="text-4xl font-black text-primary mt-3 tracking-tight font-playfair">{stat.value}</p>
            <p className="text-xs font-bold text-accent mt-4 uppercase tracking-widest bg-accent/10 rounded-full inline-block px-3 py-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden">
        <div className="p-6 border-b border-secondary/30 bg-secondary/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or plan..." 
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
              <option value="ACTIVE">Active</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-secondary/30 bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('user_name')}>
                  <div className="flex items-center gap-2">User {sortConfig?.key === 'user_name' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('planType')}>
                  <div className="flex items-center gap-2">Plan {sortConfig?.key === 'planType' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Amount</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status {sortConfig?.key === 'status' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">Date {sortConfig?.key === 'createdAt' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-primary/60 font-medium">No packages found.</td>
                </tr>
              )}
              {paginatedSubs.map((sub) => (
                <tr key={sub.id} className="border-b border-secondary/20 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-primary text-sm sm:text-base">{sub.user?.name || 'Unknown User'}</p>
                    <p className="text-xs text-primary/60 mt-1">{sub.user?.email}</p>
                  </td>
                  <td className="p-6 text-sm font-bold text-primary">
                    {sub.planType}
                  </td>
                  <td className="p-6 text-sm font-bold text-primary">
                    {sub.planType === 'Premium' ? '$120.00' : (sub.planType === 'Standard' ? '$96.00' : (sub.planType === 'Starter' ? '$60.00' : '$15.00'))}
                  </td>
                  <td className="p-6">
                    {sub.status === 'ACTIVE' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-secondary/20 border border-secondary/40 rounded-lg px-3 py-1.5 w-fit">
                        <Check size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5 w-fit">
                        <X size={14} /> {sub.status}
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium">
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right relative">
                    <button 
                      onClick={() => openEditModal(sub)}
                      className="p-2 text-primary/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                      title="Edit Package"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(sub.id)}
                      className="p-2 text-primary/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-secondary/30 bg-secondary/5 flex items-center justify-between">
            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedSubs.length)} of {processedSubs.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-secondary/40 bg-white text-primary hover:bg-secondary/10 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-secondary/40 bg-white text-primary hover:bg-secondary/10 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-secondary/30 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-6 sm:p-8 border-b border-secondary/30 bg-secondary/5">
              <h2 className="text-2xl font-black text-primary font-playfair tracking-tight">
                {selectedSub ? "Edit Package" : "New Package"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-primary/50 hover:text-accent hover:bg-accent/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form 
              action={async (formData) => {
                try {
                  if (selectedSub) {
                    await updateSubscription(selectedSub.id, formData);
                    toast.success("Package updated successfully!");
                  } else {
                    await createSubscription(formData);
                    toast.success("Package created successfully!");
                  }
                  setIsModalOpen(false);
                } catch (e: any) {
                  toast.error("An error occurred while saving.");
                }
              }}
              className="p-6 sm:p-8 space-y-6 bg-white"
            >
              {!selectedSub && (
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Select User</label>
                  <select 
                    name="userId"
                    required
                    className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">-- Choose User --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Plan Type</label>
                <select 
                  name="planType"
                  defaultValue={selectedSub?.planType || "Single Class"}
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="Single Class">Single Class ($15/session)</option>
                  <option value="Starter">Starter ($60/mo)</option>
                  <option value="Standard">Standard ($96/mo)</option>
                  <option value="Premium">Premium ($120/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Status</label>
                <select 
                  name="status"
                  defaultValue={selectedSub?.status || "ACTIVE"}
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-secondary/20">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-secondary/40 text-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-secondary/20 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-accent hover:bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                >
                  {selectedSub ? "Save Changes" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
