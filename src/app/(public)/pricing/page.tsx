import React from 'react';
import { getPackages } from '@/actions/package-actions';
import PricingCards from './_components/PricingCards';

export const metadata = {
  title: 'Pricing | HD Clarity Speech',
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
          <h1 className="text-5xl md:text-6xl font-black text-primary mb-6 transition-all duration-300 font-playfair">Invest In Your Growth</h1>
          <p className="text-lg md:text-xl text-primary/80 leading-relaxed transition-colors duration-300 max-w-2xl mx-auto">
            Choose the coaching package that fits your goals and budget. All sessions are 60 minutes long and personalized to you.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <PricingCards packages={activePackages} />
      </section>
    </div>
  );
}