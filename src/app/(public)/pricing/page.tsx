'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Script from 'next/script';

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (amount: number, planName: string) => {
    setIsProcessing(true);

    // Check if script is loaded
    if (!(window as any).Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order on our backend
      const res = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      if (!res.ok) {
        throw new Error(order.error || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: 'HD Clarity Speech',
        description: `Purchase: ${planName}`,
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          // Here you would typically verify the signature on your backend via webhook or another API route
        },
        prefill: {
          name: 'Student Name',
          email: 'student@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#2563EB' // blue-600
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Something went wrong during checkout!');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 pt-24 min-h-screen transition-colors duration-300">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Header */}
      <section className="px-6 py-20 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h4 className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase mb-4 text-sm transition-colors duration-300">Pricing Plans</h4>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mb-6 transition-all duration-300">Invest In Your Growth</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300 max-w-2xl mx-auto">
            Choose the coaching package that fits your goals and budget. All sessions are 60 minutes long and personalized to you.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Basic Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">Basic</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 transition-colors duration-300">Perfect for focused, short-term help.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">₹999</span>
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300"> / session</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300">
                <CheckCircle2 className="text-blue-500" size={18} /> 1 Live Session
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300">
                <CheckCircle2 className="text-blue-500" size={18} /> Topic Specific Focus
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300">
                <CheckCircle2 className="text-blue-500" size={18} /> Email Support for 1 Week
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(999, 'Basic Plan (1 Session)')}
              className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-8 border border-slate-700 dark:border-slate-800 shadow-2xl flex flex-col relative transform lg:-translate-y-4 transition-all duration-300 ring-2 ring-blue-500/50 hover:ring-blue-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro Package</h3>
            <p className="text-slate-400 mb-6">Comprehensive training and ongoing review.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">₹3,499</span>
              <span className="text-slate-400"> / 4 sessions</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-blue-400" size={18} /> 4 Live Sessions
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-blue-400" size={18} /> Full Curriculum Design
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-blue-400" size={18} /> Priority Scheduling
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-blue-400" size={18} /> 24/7 Email & Chat Support
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(3499, 'Pro Package (4 Sessions)')}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60"
            >
              Choose Pro
            </button>
          </div>

          {/* Masterclass Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">Masterclass</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 transition-colors duration-300">Intensive long-term mentorship program.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">₹7,999</span>
              <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300"> / 10 sessions</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300">
                <CheckCircle2 className="text-blue-500" size={18} /> 10 Live Sessions
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300">
                <CheckCircle2 className="text-blue-500" size={18} /> Custom Growth Roadmap
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300">
                <CheckCircle2 className="text-blue-500" size={18} /> Interview/Mock Prep
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors duration-300">
                <CheckCircle2 className="text-blue-500" size={18} /> Lifetime Discord Access
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(7999, 'Masterclass (10 Sessions)')}
              className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors duration-300"
            >
              Get Started
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}