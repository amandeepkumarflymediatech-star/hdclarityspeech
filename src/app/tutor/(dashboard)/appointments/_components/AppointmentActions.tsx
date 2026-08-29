'use client';

import React, { useState } from 'react';
import { cancelSession } from '../actions';
import Swal from 'sweetalert2';

export default function AppointmentActions({ sessionId }: { sessionId: string }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: 'Cancel Session?',
      text: 'Are you sure you want to cancel this session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      setIsCancelling(true);
      try {
        await cancelSession(sessionId, 'Tutor initiated cancellation');
        Swal.fire('Cancelled!', 'Session cancelled successfully.', 'success');
      } catch (e: any) {
        Swal.fire('Error', e.message || 'Failed to cancel session', 'error');
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
        onClick={() => Swal.fire('Info', 'Rescheduling is typically handled via Calendly or contacting support directly.', 'info')}
        className="flex-1 px-4 py-2.5 bg-secondary/10 border border-secondary/50 text-primary font-bold uppercase tracking-widest text-xs hover:bg-secondary/30 rounded-xl transition-colors text-center"
      >
        Reschedule
      </button>
    </div>
  );
}
