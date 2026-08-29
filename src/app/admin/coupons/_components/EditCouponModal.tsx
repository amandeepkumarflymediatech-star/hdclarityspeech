'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateCoupon } from '../actions';
import { toast } from 'sonner';

interface Props {
  coupon: any;
  onClose: () => void;
}

export default function EditCouponModal({ coupon, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: coupon.code,
    description: coupon.description || '',
    discountType: coupon.discountType,
    discountValue: coupon.discountValue.toString(),
    maxUses: coupon.maxUses ? coupon.maxUses.toString() : '',
    validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      code: formData.code,
      description: formData.description,
      discountType: formData.discountType as 'PERCENTAGE' | 'FIXED_AMOUNT',
      discountValue: parseFloat(formData.discountValue),
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
    };

    const res = await updateCoupon(coupon.id, data);
    
    setLoading(false);
    if (res.success) {
      toast.success('Coupon updated successfully!');
      onClose();
    } else {
      toast.error(res.error || 'Failed to update coupon');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-secondary/50">
          <h2 className="text-xl font-bold text-primary font-playfair">Edit Coupon</h2>
          <button onClick={onClose} className="text-primary/50 hover:text-accent transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">Coupon Code</label>
            <input 
              type="text" 
              required
              className="w-full border border-secondary p-3 rounded-lg focus:outline-none focus:border-accent uppercase"
              placeholder="SUMMER20"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">Description</label>
            <input 
              type="text" 
              className="w-full border border-secondary p-3 rounded-lg focus:outline-none focus:border-accent"
              placeholder="Summer discount for new students"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">Type</label>
              <select 
                className="w-full border border-secondary p-3 rounded-lg focus:outline-none focus:border-accent"
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">Value</label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full border border-secondary p-3 rounded-lg focus:outline-none focus:border-accent"
                placeholder={formData.discountType === 'PERCENTAGE' ? '20' : '500'}
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">Max Uses (Optional)</label>
              <input 
                type="number" 
                min="1"
                className="w-full border border-secondary p-3 rounded-lg focus:outline-none focus:border-accent"
                placeholder="Unlimited"
                value={formData.maxUses}
                onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">Valid Until (Optional)</label>
              <input 
                type="date" 
                className="w-full border border-secondary p-3 rounded-lg focus:outline-none focus:border-accent"
                value={formData.validUntil}
                onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-secondary text-primary font-bold rounded-xl hover:bg-secondary/20 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 px-4 bg-accent text-white font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
