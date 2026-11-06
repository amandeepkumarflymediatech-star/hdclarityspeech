'use client';

import React, { useEffect, useState } from 'react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { bookDiscoveryClass } from '@/actions/student-actions';
import { Loader2 } from 'lucide-react';

interface DiscoveryClassBookingWidgetProps {
  calendlyUrl: string;
  prefillName?: string;
  prefillEmail?: string;
  tutorId?: string;
}

export default function DiscoveryClassBookingWidget({
  calendlyUrl,
  prefillName = '',
  prefillEmail = '',
  tutorId,
}: DiscoveryClassBookingWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [widgetHeight, setWidgetHeight] = useState('660px');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const updateHeight = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setWidgetHeight('580px');
        } else if (window.innerWidth < 1024) {
          setWidgetHeight('650px');
        } else {
          setWidgetHeight('700px');
        }
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      try {
        setIsProcessing(true);
        const eventUri = e.data.payload.event.uri;
        const inviteeUri = e.data.payload.invitee.uri;

        toast.loading('Confirming your free Discovery Class...', { id: 'booking-demo' });

        const result = await bookDiscoveryClass(eventUri, inviteeUri, tutorId);

        if (result?.success) {
          toast.success('🎉 Discovery Class scheduled successfully!', {
            id: 'booking-demo',
            description: 'Your session has been added to your student portal.',
            duration: 5000,
          });
          router.push('/student/appointments');
          router.refresh();
        } else {
          toast.error('Could not complete demo booking.', { id: 'booking-demo' });
          setIsProcessing(false);
        }
      } catch (error: any) {
        console.error('Error booking discovery class:', error);
        toast.error(error?.message || 'Failed to sync your Discovery Class. Please contact support.', {
          id: 'booking-demo',
        });
        setIsProcessing(false);
      }
    },
  });

  if (!mounted) {
    return (
      <div className="min-h-[560px] sm:min-h-[620px] md:min-h-[650px] lg:min-h-[700px] w-full bg-secondary/10 rounded-xl sm:rounded-2xl md:rounded-[20px] lg:rounded-[24px] animate-pulse flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-accent animate-spin mb-3 sm:mb-4" />
        <p className="text-primary/70 font-bold uppercase tracking-wider text-xs sm:text-sm">
          Loading Discovery Schedule...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[20px] lg:rounded-[24px]">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl md:rounded-[20px] lg:rounded-[24px] p-6 text-center">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-accent animate-spin mb-3 sm:mb-4" />
          <h4 className="text-base sm:text-lg md:text-xl font-black font-playfair text-primary mb-2">Finalizing Your Booking</h4>
          <p className="text-primary/70 text-xs sm:text-sm max-w-sm">
            Saving your Discovery Class to your student dashboard...
          </p>
        </div>
      )}

      <InlineWidget
        url={calendlyUrl}
        styles={{ height: widgetHeight, width: '100%', minHeight: '560px' }}
        prefill={{
          name: prefillName,
          email: prefillEmail,
        }}
      />
    </div>
  );
}
