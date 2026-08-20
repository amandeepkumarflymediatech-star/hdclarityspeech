"use client";

import { useState } from "react";
import { CreditCard, Download, Search, Check, X, MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import { createSubscription, updateSubscription, deleteSubscription } from "@/actions/admin-actions";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  const filteredSubs = subscriptions.filter(sub => 
    (sub.user?.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (sub.user?.email.toLowerCase() || "").includes(search.toLowerCase()) ||
    sub.planType.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setSelectedSub(null);
    setIsModalOpen(true);
    setActionMenuOpenId(null);
  };

  const openEditModal = (sub: Subscription) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
    setActionMenuOpenId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      await deleteSubscription(id);
    }
    setActionMenuOpenId(null);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Subscriptions</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage billing and active subscription plans.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button 
            onClick={openCreateModal}
            className="px-8 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-colors rounded-none flex items-center justify-center gap-2 flex-1 sm:flex-auto"
          >
            <Plus size={18} />
            New Subscription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Total Active', value: subscriptions.filter(s => s.status === 'ACTIVE').length.toString(), sub: 'Current Active Plans' },
          { title: 'Total Cancelled', value: subscriptions.filter(s => s.status === 'CANCELLED').length.toString(), sub: 'Past Subscriptions' },
          { title: 'Total Subscriptions', value: subscriptions.length.toString(), sub: 'All Time' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-secondary p-8">
            <h3 className="text-xs font-bold text-primary/60 uppercase tracking-widest">{stat.title}</h3>
            <p className="text-4xl font-black text-primary mt-3 tracking-tight font-playfair">{stat.value}</p>
            <p className="text-xs font-bold text-accent mt-4 uppercase tracking-widest bg-accent/10 inline-block px-2 py-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-secondary flex flex-col shadow-sm">
        <div className="p-6 border-b border-secondary bg-secondary/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search subscriptions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-secondary pl-12 pr-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors placeholder-primary/40 rounded-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-secondary bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">User</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Plan</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Amount</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Status</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Date</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-primary/60">No subscriptions found.</td>
                </tr>
              )}
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="border-b border-secondary last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-primary text-sm sm:text-base">{sub.user?.name || 'Unknown User'}</p>
                    <p className="text-xs text-primary/60">{sub.user?.email}</p>
                  </td>
                  <td className="p-6 text-sm font-bold text-primary">
                    {sub.planType}
                  </td>
                  <td className="p-6 text-sm font-bold text-primary">
                    {sub.planType === 'PREMIUM' ? '$49.00' : (sub.planType === 'BASIC' ? '$19.00' : '$99.00')}
                  </td>
                  <td className="p-6">
                    {sub.status === 'ACTIVE' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-secondary/50 border border-secondary px-3 py-1 w-fit">
                        <Check size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1 w-fit">
                        <X size={14} /> {sub.status}
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium">
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right relative">
                    <button 
                      onClick={() => setActionMenuOpenId(actionMenuOpenId === sub.id ? null : sub.id)}
                      className="p-2 text-primary/40 hover:text-accent transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    {actionMenuOpenId === sub.id && (
                      <div className="absolute right-6 top-14 bg-white border border-secondary shadow-lg z-10 w-48 text-left animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          onClick={() => openEditModal(sub)}
                          className="w-full px-4 py-3 text-sm font-bold text-primary hover:bg-secondary/30 transition-colors flex items-center gap-2"
                        >
                          <Edit size={16} /> Edit Subscription
                        </button>
                        <button 
                          onClick={() => handleDelete(sub.id)}
                          className="w-full px-4 py-3 text-sm font-bold text-accent hover:bg-accent/10 transition-colors flex items-center gap-2 border-t border-secondary"
                        >
                          <Trash2 size={16} /> Delete Subscription
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-secondary w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-secondary">
              <h2 className="text-xl font-black text-primary font-playfair tracking-tight">
                {selectedSub ? "Edit Subscription" : "New Subscription"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary/50 hover:text-accent transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form 
              action={async (formData) => {
                if (selectedSub) {
                  await updateSubscription(selectedSub.id, formData);
                } else {
                  await createSubscription(formData);
                }
                setIsModalOpen(false);
              }}
              className="p-6 space-y-6"
            >
              {!selectedSub && (
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Select User</label>
                  <select 
                    name="userId"
                    required
                    className="w-full bg-secondary/10 border-b-2 border-secondary px-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors appearance-none"
                  >
                    <option value="">-- Choose User --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Plan Type</label>
                <select 
                  name="planType"
                  defaultValue={selectedSub?.planType || "BASIC"}
                  className="w-full bg-secondary/10 border-b-2 border-secondary px-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors appearance-none"
                >
                  <option value="BASIC">Basic ($19/mo)</option>
                  <option value="PREMIUM">Premium ($49/mo)</option>
                  <option value="PRO">Pro ($99/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Status</label>
                <select 
                  name="status"
                  defaultValue={selectedSub?.status || "ACTIVE"}
                  className="w-full bg-secondary/10 border-b-2 border-secondary px-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors appearance-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-secondary text-primary font-bold uppercase tracking-widest text-xs hover:bg-secondary/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-accent hover:bg-primary text-white font-bold uppercase tracking-widest text-xs transition-colors shadow-sm"
                >
                  {selectedSub ? "Save Changes" : "Create Subscription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
