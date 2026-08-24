'use client';

import React, { useState } from 'react';
import { requestPayout } from '../actions';

export default function RequestPayoutButton({ disabled }: { disabled: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await requestPayout();
      alert('Payout requested successfully. Processing may take up to 3 business days.');
    } catch (e: any) {
      alert(e.message || 'Failed to request payout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleRequest}
      disabled={disabled || loading}
      className="w-full py-4 bg-white text-accent hover:bg-secondary/10 font-bold uppercase tracking-widest text-xs transition-colors rounded-2xl shadow-lg border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : 'Request Payout'}
    </button>
  );
}
