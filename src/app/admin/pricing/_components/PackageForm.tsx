'use client';

import React, { useState } from 'react';
import { createPackage, updatePackage } from '@/actions/package-actions';
import Swal from 'sweetalert2';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PackageFormProps {
  initialData?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PackageForm({ initialData, onClose, onSuccess }: PackageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuresList, setFeaturesList] = useState<string[]>(
    initialData?.features ? JSON.parse(initialData.features) : ['']
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      totalSessions: formData.get('totalSessions') as string,
      price: formData.get('price') as string,
      discount: formData.get('discount') as string,
      validityDays: formData.get('validityDays') as string,
      isActive: formData.get('isActive') === 'true',
      isPopular: formData.get('isPopular') === 'true',
      features: JSON.stringify(featuresList.filter(f => f.trim() !== ''))
    };

    let result;
    if (initialData) {
      result = await updatePackage(initialData.id, data);
    } else {
      result = await createPackage(data);
    }

    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Package ${initialData ? 'updated' : 'created'} successfully!`);
      onSuccess();
    } else {
      Swal.fire('Error', result.error, 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-secondary/30 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-secondary/30 bg-secondary/5 shrink-0">
          <h2 className="text-2xl font-black text-primary font-playfair tracking-tight">
            {initialData ? 'Edit Package' : 'Create New Package'}
          </h2>
          <button onClick={onClose} className="p-2 text-primary/50 hover:text-accent hover:bg-accent/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 bg-white overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Package Name</label>
              <input required name="name" defaultValue={initialData?.name} className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white" placeholder="e.g. Premium Plan" />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Price ($)</label>
              <input required type="number" step="0.01" name="price" defaultValue={initialData?.price} className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Total Sessions</label>
              <input required type="number" name="totalSessions" defaultValue={initialData?.totalSessions} className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white" placeholder="e.g. 12" />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Validity (Days)</label>
              <input required type="number" name="validityDays" defaultValue={initialData?.validityDays || 30} className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white" />
            </div>
            {/* <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Discount Amount ($)</label>
              <input type="number" step="0.01" name="discount" defaultValue={initialData?.discount || ''} className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white" />
            </div> */}
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Description</label>
            <textarea name="description" defaultValue={initialData?.description || ''} className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white min-h-[100px]" placeholder="Brief summary of this package..."></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-1">Features (Bullet Points)</label>
            <div className="space-y-3 mb-3">
              {featuresList.map((feature, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-accent/40 shrink-0 ml-1"></div>
                  <input 
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...featuresList];
                      newFeatures[idx] = e.target.value;
                      setFeaturesList(newFeatures);
                    }}
                    className="flex-1 bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all hover:bg-white" 
                    placeholder="e.g. 4 Classes / Month"
                  />
                  <button 
                    type="button" 
                    onClick={() => setFeaturesList(featuresList.filter((_, i) => i !== idx))}
                    className="p-2 text-primary/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Remove feature"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button"
              onClick={() => setFeaturesList([...featuresList, ''])}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-widest ml-4 transition-colors"
            >
              <Plus size={16} /> Add Feature
            </button>
          </div>

          <div className="flex gap-6 pt-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" name="isActive" value="true" defaultChecked={initialData ? initialData.isActive : true} className="peer sr-only" />
                <div className="w-10 h-6 bg-secondary/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </div>
              <span className="text-sm font-bold text-primary group-hover:text-accent transition-colors">Active Package</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" name="isPopular" value="true" defaultChecked={initialData?.isPopular} className="peer sr-only" />
                <div className="w-10 h-6 bg-secondary/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-sm font-bold text-primary group-hover:text-blue-600 transition-colors">Most Popular Badge</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-secondary/20 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-secondary/40 text-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-secondary/20 transition-colors">
              Cancel
            </button>
            <button disabled={isSubmitting} type="submit" className="px-6 py-3 bg-accent hover:bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 min-w-[140px]">
              {isSubmitting ? 'Saving...' : 'Save Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
