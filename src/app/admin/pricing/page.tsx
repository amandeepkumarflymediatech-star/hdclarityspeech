'use client';

import React, { useEffect, useState } from 'react';
import { Package } from '@prisma/client';
import { getPackages, deletePackage } from '@/actions/package-actions';
import PackageForm from './_components/PackageForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminPricingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<any | null | undefined>(undefined);

  const loadPackages = async () => {
    setLoading(true);
    const data = await getPackages();
    setPackages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Package?',
      text: "Are you sure you want to delete this pricing package?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!'
    });

    if (result.isConfirmed) {
      const res = await deletePackage(id);
      if (res.success) {
        Swal.fire('Deleted!', 'Package has been deleted.', 'success');
        loadPackages();
      } else {
        Swal.fire('Error', res.error, 'error');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Pricing Tiers</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Manage all pricing packages available to students.</p>
        </div>
        <button
          onClick={() => setEditingPackage(null)}
          className="px-8 py-3.5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Create Package
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-primary/60 font-medium">Loading packages...</div>
      ) : (
        <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-secondary/30 bg-secondary/10">
                  <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Name</th>
                  <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Price</th>
                  <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Sessions</th>
                  <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-primary/60 font-medium">No packages found.</td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-secondary/20 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-6">
                        <div className="font-bold text-primary text-sm sm:text-base flex items-center gap-3">
                          {pkg.name}
                          {(pkg as any).isPopular && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border bg-accent/10 border-accent/20 text-accent">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-primary/60 mt-1">{pkg.description?.substring(0, 60)}{pkg.description && pkg.description.length > 60 ? '...' : ''}</div>
                      </td>
                      <td className="p-6 font-black text-primary text-lg">${pkg.price}</td>
                      <td className="p-6 text-primary/80 font-medium">{pkg.totalSessions} class{pkg.totalSessions > 1 ? 'es' : ''}</td>
                      <td className="p-6">
                        {pkg.isActive ? (
                          <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border bg-primary/5 border-primary/20 text-primary">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border bg-red-50 border-red-200 text-red-600">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-right relative">
                        <button 
                          onClick={() => setEditingPackage(pkg)}
                          className="p-2 text-primary/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2 text-primary/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingPackage !== undefined && (
        <PackageForm 
          initialData={editingPackage} 
          onClose={() => setEditingPackage(undefined)}
          onSuccess={() => {
            setEditingPackage(undefined);
            loadPackages();
          }}
        />
      )}
    </div>
  );
}
