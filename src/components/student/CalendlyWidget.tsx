"use client";

import { useEffect, useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSessionFromCalendly } from "@/actions/student-actions"; // Trigger TS re-check

interface CalendlyWidgetProps {
  url: string;
  prefillName: string;
  prefillEmail: string;
  tutorId: string;
}

export default function CalendlyWidget({ url, prefillName, prefillEmail, tutorId }: CalendlyWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      try {
        const eventUri = e.data.payload.event.uri;
        const inviteeUri = e.data.payload.invitee.uri;
        
        toast.loading("Syncing your session with the platform...");
        
        await createSessionFromCalendly(tutorId, eventUri, inviteeUri);
        
        toast.success("Session booked successfully!");
        router.push("/student/appointments");
      } catch (error) {
        toast.error("Failed to sync session with platform. Please contact support.");
        console.error(error);
      }
    },
  });

  if (!mounted) {
    return (
      <div className="h-[700px] w-full bg-secondary/10 animate-pulse flex items-center justify-center">
        <p className="text-primary/50 font-bold uppercase tracking-widest text-sm">Loading Calendar...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InlineWidget 
        url={url} 
        styles={{ height: '800px', width: '100%' }}
        prefill={{
          name: prefillName,
          email: prefillEmail,
        }}
      />
    </div>
  );
}
