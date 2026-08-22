"use client";

import { useState, useMemo } from "react";
import { Users as UsersIcon, MoreVertical, Search, Filter, X, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { createUser, updateUser, deleteUser } from "@/actions/admin-actions";
import { Role } from "@prisma/client";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
};

export default function UserManagementClient({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Sorting, Filtering, and Pagination logic
  const processedUsers = useMemo(() => {
    let result = [...users];

    // 1. Filter
    if (roleFilter !== "ALL") {
      result = result.filter(u => u.role === roleFilter);
    }

    // 2. Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(u => 
        (u.name?.toLowerCase() || "").includes(lowerSearch) || 
        u.email.toLowerCase().includes(lowerSearch)
      );
    }

    // 3. Sort
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
  }, [users, search, roleFilter, sortConfig]);

  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const paginatedUsers = processedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Manage Users</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">View, filter, and manage all registered accounts.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-8 py-3.5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <UsersIcon size={18} />
          Add User
        </button>
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-secondary/30 bg-secondary/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-secondary/40 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent text-primary outline-none transition-all placeholder-primary/40 shadow-sm"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto items-center">
            <span className="text-sm font-bold text-primary/60 uppercase tracking-widest hidden sm:block">Filter:</span>
            <select 
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value as any); setCurrentPage(1); }}
              className="w-full sm:w-auto px-4 py-3 bg-white border border-secondary/40 rounded-xl text-xs font-bold text-primary outline-none uppercase tracking-widest focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="TUTOR">Tutor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-secondary/30 bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Name {sortConfig?.key === 'name' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('role')}>
                  <div className="flex items-center gap-2">Role {sortConfig?.key === 'role' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">Joined {sortConfig?.key === 'createdAt' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-primary/60 font-medium">No users match your criteria.</td>
                </tr>
              )}
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-secondary/20 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-primary text-sm sm:text-base">{user.name || 'Unknown User'}</p>
                    <p className="text-sm text-primary/60">{user.email}</p>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border ${user.role === 'TUTOR' ? 'bg-primary/5 border-primary/20 text-primary' : (user.role === 'ADMIN' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-secondary/20 border-secondary/40 text-primary')}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right relative">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-2 text-primary/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                      title="Edit User"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        toast("Are you sure you want to delete this user?", {
                          action: { label: 'Confirm', onClick: () => handleDelete(user.id) }
                        });
                      }}
                      className="p-2 text-primary/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Delete User"
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedUsers.length)} of {processedUsers.length}
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
                {selectedUser ? "Edit User" : "Create User"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-primary/50 hover:text-accent hover:bg-accent/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form 
              action={async (formData) => {
                try {
                  if (selectedUser) {
                    await updateUser(selectedUser.id, formData);
                    toast.success("User updated successfully!");
                  } else {
                    await createUser(formData);
                    toast.success("User created successfully!");
                  }
                  setIsModalOpen(false);
                } catch (error) {
                  toast.error("An error occurred while saving.");
                }
              }}
              className="p-6 sm:p-8 space-y-6 bg-white overflow-y-auto"
            >
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={selectedUser?.name || ""}
                  required
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={selectedUser?.email || ""}
                  required
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Role</label>
                <select 
                  name="role"
                  defaultValue={selectedUser?.role || "STUDENT"}
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">
                  {selectedUser ? "New Password (Optional)" : "Password"}
                </label>
                <input 
                  type="password" 
                  name="password"
                  required={!selectedUser}
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white"
                />
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
                  {selectedUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
