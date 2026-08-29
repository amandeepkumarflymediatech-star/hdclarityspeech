'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tag, Plus, CheckCircle2, XCircle, Trash2, Pencil } from 'lucide-react';
import Pagination from '@/components/admin/Pagination';
import CreateCouponModal from './_components/CreateCouponModal';
import EditCouponModal from './_components/EditCouponModal';
import { toggleCouponStatus, deleteCoupon } from './actions';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

function CouponsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/coupons?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCoupons(data);
          setTotalPages(1);
        } else {
          setCoupons(data.coupons || []);
          setTotalPages(data.totalPages || 1);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [isModalOpen, editingCoupon, page]); // Refetch when modal closes or page changes

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const res = await toggleCouponStatus(id, currentStatus);
    if (res.success) {
      toast.success('Status updated');
      fetchCoupons();
    } else {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Coupon?',
      text: 'Are you sure you want to delete this coupon? This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const res = await deleteCoupon(id);
      if (res.success) {
        toast.success('Coupon deleted');
        fetchCoupons();
      } else {
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary font-playfair mb-2">Discount Coupons</h1>
          <p className="text-primary/60 text-sm">Manage promotional codes and discounts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-primary text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary bg-secondary/20 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-primary">All Coupons</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10">
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Code</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Discount</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Usage</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-primary/50 uppercase tracking-widest border-b border-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-primary/40 font-bold">Loading coupons...</td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-primary/40 font-bold italic">No coupons found. Create one above!</td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-secondary/50 hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-accent bg-accent/10 px-2 py-1 rounded text-sm">{coupon.code}</span>
                      {coupon.description && <span className="block text-xs font-normal text-primary/50 mt-1">{coupon.description}</span>}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold">{coupon.usedCount}</span>
                      {coupon.maxUses ? <span className="text-primary/50"> / {coupon.maxUses}</span> : <span className="text-primary/50"> / ∞</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggle(coupon.id, coupon.isActive)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-colors ${
                          coupon.isActive ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'
                        }`}
                      >
                        {coupon.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingCoupon(coupon)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Coupon"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} />
      </div>

      {isModalOpen && <CreateCouponModal onClose={() => setIsModalOpen(false)} />}
      {editingCoupon && <EditCouponModal coupon={editingCoupon} onClose={() => setEditingCoupon(null)} />}
    </div>
  );
}

export default function AdminCouponsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-primary/50 font-bold">Loading coupons...</div>}>
      <CouponsContent />
    </React.Suspense>
  );
}
