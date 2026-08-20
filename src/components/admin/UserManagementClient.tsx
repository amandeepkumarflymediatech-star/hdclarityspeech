"use client";

import { useState } from "react";
import { Users as UsersIcon, MoreVertical, Search, Filter, X, Edit, Trash2 } from "lucide-react";
import { createUser, updateUser, deleteUser } from "@/actions/admin-actions";
import { Role } from "@prisma/client";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
};

export default function UserManagementClient({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || "").includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
    setActionMenuOpenId(null);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setActionMenuOpenId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
    setActionMenuOpenId(null);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Manage Users</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">View and manage all registered accounts.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-8 py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-colors rounded-none flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <UsersIcon size={18} />
          Add User
        </button>
      </div>

      <div className="bg-white border border-secondary flex flex-col shadow-sm">
        <div className="p-6 border-b border-secondary bg-secondary/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-secondary pl-12 pr-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors placeholder-primary/40 rounded-none"
            />
          </div>
          <button className="w-full sm:w-auto px-6 py-3 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-secondary bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Name</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Role</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Joined</th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-primary/60">No users found.</td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-secondary last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-primary text-sm sm:text-base">{user.name || 'Unknown User'}</p>
                    <p className="text-sm text-primary/60">{user.email}</p>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border ${user.role === 'TUTOR' ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary border-secondary text-primary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right relative">
                    <button 
                      onClick={() => setActionMenuOpenId(actionMenuOpenId === user.id ? null : user.id)}
                      className="p-2 text-primary/40 hover:text-accent transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    {actionMenuOpenId === user.id && (
                      <div className="absolute right-6 top-14 bg-white border border-secondary shadow-lg z-10 w-48 text-left animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="w-full px-4 py-3 text-sm font-bold text-primary hover:bg-secondary/30 transition-colors flex items-center gap-2"
                        >
                          <Edit size={16} /> Edit User
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="w-full px-4 py-3 text-sm font-bold text-accent hover:bg-accent/10 transition-colors flex items-center gap-2 border-t border-secondary"
                        >
                          <Trash2 size={16} /> Delete User
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
                {selectedUser ? "Edit User" : "Create User"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary/50 hover:text-accent transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form 
              action={async (formData) => {
                if (selectedUser) {
                  await updateUser(selectedUser.id, formData);
                } else {
                  await createUser(formData);
                }
                setIsModalOpen(false);
              }}
              className="p-6 space-y-6"
            >
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={selectedUser?.name || ""}
                  required
                  className="w-full bg-secondary/10 border-b-2 border-secondary px-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={selectedUser?.email || ""}
                  required
                  className="w-full bg-secondary/10 border-b-2 border-secondary px-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Role</label>
                <select 
                  name="role"
                  defaultValue={selectedUser?.role || "STUDENT"}
                  className="w-full bg-secondary/10 border-b-2 border-secondary px-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors appearance-none"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">
                  {selectedUser ? "New Password (Leave blank to keep current)" : "Password"}
                </label>
                <input 
                  type="password" 
                  name="password"
                  required={!selectedUser}
                  className="w-full bg-secondary/10 border-b-2 border-secondary px-4 py-3 text-sm focus:border-accent text-primary outline-none transition-colors"
                />
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
