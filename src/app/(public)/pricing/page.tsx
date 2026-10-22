import React from 'react';
import { getPackages } from '@/actions/package-actions';
import PricingCards from './_components/PricingCards';
import { Flame } from 'lucide-react';

export const metadata = {
  title: 'Packages & Pricing | HD Clarity Speech',
  description: 'Choose the coaching package that fits your goals and budget.',
};

export default async function PricingPage() {
  const packages = await getPackages();
  const activePackages = packages.filter((pkg: any) => pkg.isActive);

  return (
    <div className="w-full font-sans text-primary bg-white pt-24 min-h-screen transition-colors duration-300">
      {/* Header */}
      <section className="px-6 py-8 md:py-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-primary mb-6 transition-all duration-300 font-playfair">
            Packages & Pricing
          </h1>
          <p className="text-lg md:text-xl text-primary/80 max-w-2xl mx-auto font-sans">
            Choose the coaching package that fits your goals and budget. All sessions are 1 hour long and personalized to you.
          </p>
        </div>
      </section>

      {/* Limited Seats Urgency Alert Banner */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="bg-[#F7F5F0] border border-accent/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary font-sans flex items-center gap-2">
                Limited Availability: Only 4 1-on-1 Seats Left This Month
              </p>
              <p className="text-xs text-primary/70 font-sans">
                Each coach caps their monthly cohort at 10 active clients. Use coupon <span className="font-mono font-bold text-primary bg-white px-1.5 py-0.5 rounded border border-primary/10">CLARITY20</span> for 20% off.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1.5 rounded-full">
              4 Slots Remaining
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <PricingCards packages={activePackages} />
      </section>
    </div>
  );
}