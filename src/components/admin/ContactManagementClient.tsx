"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Search, CheckCircle, Clock, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { updateContactStatus, deleteContact } from "@/actions/contact-actions";
import { toast } from "sonner";
import Swal from "sweetalert2";

type Contact = {
  id: string;
  name: string;
  email: string;
  studyPreference: string;
  message: string;
  createdAt: Date;
  status: string;
};

export default function ContactManagementClient({ contacts }: { contacts: Contact[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Contact; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const processedContacts = useMemo(() => {
    let result = [...contacts];

    if (statusFilter !== "ALL") {
      result = result.filter(c => c.status === statusFilter);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lowerSearch) || 
        c.email.toLowerCase().includes(lowerSearch) ||
        c.message.toLowerCase().includes(lowerSearch)
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
  }, [contacts, search, statusFilter, sortConfig]);

  const totalPages = Math.ceil(processedContacts.length / itemsPerPage);
  const paginatedContacts = processedContacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof Contact) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleStatus = async (id: string, status: string) => {
    await updateContactStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Message?',
      text: 'Are you sure you want to delete this message?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!'
    });

    if (result.isConfirmed) {
      await deleteContact(id);
      toast.success("Message deleted");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between items-start border-b border-secondary/50 pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Contact Messages</h1>
        <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">View and manage inquiries from the public contact form.</p>
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-secondary/30 bg-secondary/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
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
              <option value="ALL">All Messages</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-secondary/30 bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Sender {sortConfig?.key === 'name' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Message</th>
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
              {paginatedContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-primary/60 font-medium">No messages found.</td>
                </tr>
              )}
              {paginatedContacts.map((contact) => (
                <tr key={contact.id} className={`border-b border-secondary/20 last:border-0 hover:bg-gray-50 transition-colors ${contact.status === 'UNREAD' ? 'bg-secondary/5' : ''}`}>
                  <td className="p-6 w-1/4">
                    <p className="font-bold text-primary text-sm sm:text-base flex items-center gap-2">
                      {contact.name}
                      {contact.status === 'UNREAD' && <span className="w-2 h-2 rounded-full bg-accent"></span>}
                    </p>
                    <a href={`mailto:${contact.email}`} className="text-sm text-primary/60 hover:text-accent transition-colors flex items-center gap-1 mt-1">
                      <Mail size={12} /> {contact.email}
                    </a>
                  </td>
                  <td className="p-6 w-2/5">
                    <p className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">{contact.studyPreference}</p>
                    <p className="text-sm text-primary/80 line-clamp-2" title={contact.message}>{contact.message}</p>
                  </td>
                  <td className="p-6">
                    {contact.status === 'UNREAD' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5 w-fit">
                        <Clock size={14} /> Unread
                      </span>
                    ) : contact.status === 'READ' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 w-fit">
                        <MessageSquare size={14} /> Read
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-1.5 w-fit">
                        <CheckCircle size={14} /> Resolved
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium whitespace-nowrap">
                    {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right relative flex gap-1 justify-end">
                    {contact.status !== 'READ' && (
                      <button 
                        onClick={() => handleStatus(contact.id, 'READ')}
                        className="p-2 text-primary/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as Read"
                      >
                        <MessageSquare size={18} />
                      </button>
                    )}
                    {contact.status !== 'RESOLVED' && (
                      <button 
                        onClick={() => handleStatus(contact.id, 'RESOLVED')}
                        className="p-2 text-primary/40 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark Resolved"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-primary/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Delete Message"
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedContacts.length)} of {processedContacts.length}
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
