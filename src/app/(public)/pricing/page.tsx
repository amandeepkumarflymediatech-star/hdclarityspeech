'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Script from 'next/script';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePayment = async (amount: number, planName: string) => {
    if (status === 'unauthenticated' || !session) {
      router.push('/login');
      return;
    }

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
    <div className="w-full font-sans text-primary bg-white pt-24 min-h-screen transition-colors duration-300">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Header */}
      <section className="px-6 py-20 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm transition-colors duration-300">Pricing Plans</h4>
          <h1 className="text-5xl md:text-6xl font-black text-primary mb-6 transition-all duration-300 font-playfair">Invest In Your Growth</h1>
          <p className="text-lg md:text-xl text-primary/80 leading-relaxed transition-colors duration-300 max-w-2xl mx-auto">
            Choose the coaching package that fits your goals and budget. All sessions are 60 minutes long and personalized to you.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Basic Plan */}
          <div className="bg-white rounded-none p-10 border border-secondary shadow-sm flex flex-col transition-colors duration-300 hover:bg-secondary/20">
            <h3 className="text-2xl font-bold text-primary mb-2 font-playfair transition-colors duration-300">Basic</h3>
            <p className="text-primary/70 mb-6 transition-colors duration-300">Perfect for focused, short-term help.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-primary transition-colors duration-300">₹999</span>
              <span className="text-primary/70 transition-colors duration-300"> / session</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-medium">
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> 1 Live Session
              </li>
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> Topic Specific Focus
              </li>
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> Email Support for 1 Week
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(999, 'Basic Plan (1 Session)')}
              className="w-full py-4 px-6 bg-secondary hover:bg-primary hover:text-white text-primary font-bold uppercase tracking-wider text-sm rounded-none transition-colors duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-primary rounded-none p-10 border-t-8 border-accent shadow-2xl flex flex-col relative transform lg:-translate-y-4 transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-6 py-2 rounded-none text-xs font-bold tracking-widest uppercase">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-playfair">Pro Package</h3>
            <p className="text-white/70 mb-6">Comprehensive training and ongoing review.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">₹3,499</span>
              <span className="text-white/70"> / 4 sessions</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-medium">
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-accent" size={18} /> 4 Live Sessions
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-accent" size={18} /> Full Curriculum Design
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-accent" size={18} /> Priority Scheduling
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-accent" size={18} /> 24/7 Email & Chat Support
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(3499, 'Pro Package (4 Sessions)')}
              className="w-full py-5 px-6 bg-accent hover:bg-white hover:text-primary text-white font-bold uppercase tracking-wider text-sm rounded-none transition-all duration-300"
            >
              Choose Pro
            </button>
          </div>

          {/* Masterclass Plan */}
          <div className="bg-white rounded-none p-10 border border-secondary shadow-sm flex flex-col transition-colors duration-300 hover:bg-secondary/20">
            <h3 className="text-2xl font-bold text-primary mb-2 font-playfair transition-colors duration-300">Masterclass</h3>
            <p className="text-primary/70 mb-6 transition-colors duration-300">Intensive long-term mentorship program.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-primary transition-colors duration-300">₹7,999</span>
              <span className="text-primary/70 transition-colors duration-300"> / 10 sessions</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-medium">
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> 10 Live Sessions
              </li>
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> Custom Growth Roadmap
              </li>
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> Interview/Mock Prep
              </li>
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> Lifetime Access
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(7999, 'Masterclass (10 Sessions)')}
              className="w-full py-4 px-6 bg-secondary hover:bg-primary hover:text-white text-primary font-bold uppercase tracking-wider text-sm rounded-none transition-colors duration-300"
            >
              Get Started
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}