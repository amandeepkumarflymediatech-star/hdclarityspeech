'use client';

import React, { useState } from 'react';
import { cancelSession } from '../actions';

export default function AppointmentActions({ sessionId }: { sessionId: string }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this session?')) {
      setIsCancelling(true);
      try {
        await cancelSession(sessionId, 'Tutor initiated cancellation');
        alert('Session cancelled successfully.');
      } catch (e: any) {
        alert(e.message || 'Failed to cancel session');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <button 
        onClick={handleCancel}
        disabled={isCancelling}
        className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 font-bold uppercase tracking-widest text-xs hover:bg-red-100 rounded-xl transition-colors text-center disabled:opacity-50"
      >
        {isCancelling ? 'Cancelling...' : 'Cancel'}
      </button>
      <button 
        onClick={() => alert('Rescheduling is typically handled via Calendly or contacting support directly.')}
        className="flex-1 px-4 py-2.5 bg-secondary/10 border border-secondary/50 text-primary font-bold uppercase tracking-widest text-xs hover:bg-secondary/30 rounded-xl transition-colors text-center"
      >
        Reschedule
      </button>
    </div>
  );
}
