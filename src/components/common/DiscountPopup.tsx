'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Copy, Check, Clock, Flame, ArrowRight, Tag } from 'lucide-react';

export default function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const PROMO_CODE = 'CLARITY20';
  const SEATS_LEFT = 4;

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('hd_clarity_discount_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsMinimized(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
    sessionStorage.setItem('hd_clarity_discount_dismissed', 'true');
  };

  const handleCopyCode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      navigator.clipboard.writeText(PROMO_CODE);
    } catch (err) {
      console.error('Failed to copy', err);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = () => {
    try {
      navigator.clipboard.writeText(PROMO_CODE);
    } catch (err) {
      console.error('Failed to copy', err);
    }
    sessionStorage.setItem('hd_clarity_discount_dismissed', 'true');
    setIsOpen(false);
    setIsMinimized(true);
    router.push('/pricing');
  };

  return (
    <>
      {/* Floating Re-Open Badge when minimized */}
      {isMinimized && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-primary text-white hover:bg-accent border border-white/20 shadow-2xl rounded-full transition-all duration-300 hover:scale-105 group font-sans text-xs font-bold"
          aria-label="View discount offer"
        >
          <span className="w-2 h-2 rounded-full bg-accent group-hover:bg-white animate-pulse" />
          <Tag className="w-4 h-4 text-accent group-hover:text-white" />
          <span>Get 20% OFF</span>
          <span className="bg-accent/80 text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
            {SEATS_LEFT} Seats Left
          </span>
        </button>
      )}

      {/* Main Popup Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={handleClose}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-secondary/30 overflow-hidden z-10 animate-in zoom-in-95 duration-300 text-left font-sans max-h-[92vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="discount-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Urgency Header Banner */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-primary via-slate-900 to-primary text-white px-6 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                <Flame className="w-4 h-4 fill-current text-accent animate-pulse" />
                <span className="text-white">High Demand Alert:</span>
                <span className="bg-accent text-white px-2 py-0.5 rounded-full text-[10px]">
                  Only {SEATS_LEFT} Seats Remaining
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close discount popup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-accent text-[11px] font-bold uppercase tracking-wider">
                  Exclusive Welcome Offer
                </span>
              </div>

              {/* Title */}
              <h3 
                id="discount-modal-title"
                className="text-3xl sm:text-4xl font-black text-primary font-playfair tracking-tight leading-tight mb-3"
              >
                Claim Flat <span className="text-accent italic font-cormorant font-bold">20% Off</span> Your Coaching Package
              </h3>

              <p className="text-primary/70 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                Transform how you speak, lead, and command any room. Register today to lock in your discounted rate before all monthly seats are filled.
              </p>

              {/* Limited Seats Urgency Box */}
              <div className="bg-[#F7F5F0] border-l-4 border-accent p-4 rounded-r-xl mb-6 flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">
                    Limited Batch Intake Notice
                  </p>
                  <p className="text-xs text-primary/80 leading-relaxed">
                    To maintain strict 1-on-1 coaching quality, our tutors accept a limited number of new students each month. <span className="font-bold text-accent">Only {SEATS_LEFT} slots remain</span> for this intake.
                  </p>
                </div>
              </div>

              {/* Coupon Box */}
              <div className="bg-white border-2 border-dashed border-primary/20 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 hover:border-accent transition-colors">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50 block">
                    Your Promo Code
                  </span>
                  <span className="text-2xl font-black tracking-wider text-primary font-mono">
                    {PROMO_CODE}
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleClaim}
                  className="w-full py-4 bg-accent hover:bg-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Claim 20% Discount & View Packages</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 text-center text-primary/50 hover:text-primary text-xs font-bold transition-colors tracking-wide"
                >
                  No thanks, I will pay full price
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
