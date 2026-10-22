'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-primary text-white py-2 px-4 sm:px-6 text-xs sm:text-sm font-medium border-b border-white/10 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left / Center Content */}
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider shrink-0">
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
            Limited Intake
          </span>

          <span className="text-white/90 font-sans">
            Only <strong className="text-accent font-bold">4 coaching seats</strong> left for this month! Use code <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">CLARITY20</strong> for 20% OFF.
          </span>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-accent hover:text-white font-bold underline-offset-4 hover:underline transition-colors ml-1 text-xs sm:text-sm shrink-0"
          >
            <span>Claim Your Seat</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/50 hover:text-white p-1 rounded transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>

      </div>
    </div>
  );
}
