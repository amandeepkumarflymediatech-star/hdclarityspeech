'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Script from 'next/script';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

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
      Swal.fire('Error', 'Razorpay SDK failed to load. Are you online?', 'error');
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
          Swal.fire('Success', `Payment Successful! Payment ID: ${response.razorpay_payment_id}`, 'success');
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
      Swal.fire('Checkout Error', error.message || 'Something went wrong during checkout!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full font-sans text-primary bg-white pt-24 min-h-screen transition-colors duration-300">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Header */}
      <section className="px-6 py-8 md:py-10 text-center">
        <div className="max-w-3xl mx-auto">
          {/* <h4 className="text-accent font-bold tracking-widest uppercase mb-4 text-sm transition-colors duration-300">Pricing Plans</h4> */}
          <h1 className="text-5xl md:text-6xl font-black text-primary mb-6 transition-all duration-300 font-playfair">Invest In Your Growth</h1>
          <p className="text-lg md:text-xl text-primary/80 leading-relaxed transition-colors duration-300 max-w-2xl mx-auto">
            Choose the coaching package that fits your goals and budget. All sessions are 60 minutes long and personalized to you.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Single Class */}
          <div className="bg-white rounded-none p-8 border border-secondary shadow-sm flex flex-col transition-colors duration-300 hover:bg-secondary/20">
            <h3 className="text-2xl font-bold text-primary mb-2 font-playfair transition-colors duration-300">Single Class</h3>
            <p className="text-primary/70 mb-6 transition-colors duration-300 min-h-[48px]">Perfect for trying a class without a monthly commitment.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-primary transition-colors duration-300">$15</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-medium">
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> 1 Class
              </li>
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> $15 per class
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(15, 'Single Class')}
              className="w-full py-4 px-6 bg-secondary hover:bg-primary hover:text-white text-primary font-bold uppercase tracking-wider text-sm rounded-none transition-colors duration-300 mt-auto"
            >
              Get Started
            </button>
          </div>

          {/* Starter */}
          <div className="bg-white rounded-none p-8 border border-secondary shadow-sm flex flex-col transition-colors duration-300 hover:bg-secondary/20">
            <h3 className="text-2xl font-bold text-primary mb-2 font-playfair transition-colors duration-300">Starter</h3>
            <p className="text-primary/70 mb-6 transition-colors duration-300 min-h-[48px]">Consistent practice to get you started.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-primary transition-colors duration-300">$60</span>
              <span className="text-primary/70 transition-colors duration-300"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-medium">
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> 4 Classes / Month
              </li>
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> $15 per class
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(60, 'Starter Package')}
              className="w-full py-4 px-6 bg-secondary hover:bg-primary hover:text-white text-primary font-bold uppercase tracking-wider text-sm rounded-none transition-colors duration-300 mt-auto"
            >
              Get Started
            </button>
          </div>

          {/* Standard */}
          <div className="bg-white rounded-none p-8 border border-secondary shadow-sm flex flex-col transition-colors duration-300 hover:bg-secondary/20">
            <h3 className="text-2xl font-bold text-primary mb-2 font-playfair transition-colors duration-300">Standard</h3>
            <p className="text-primary/70 mb-6 transition-colors duration-300 min-h-[48px]">Accelerated progress with more sessions.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-primary transition-colors duration-300">$96</span>
              <span className="text-primary/70 transition-colors duration-300"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-medium">
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> 8 Classes / Month
              </li>
              <li className="flex items-center gap-3 text-primary transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> $12 per class
              </li>
              <li className="flex items-center gap-3 text-accent font-bold transition-colors duration-300">
                <CheckCircle2 className="text-accent" size={18} /> Save 20%
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(96, 'Standard Package')}
              className="w-full py-4 px-6 bg-secondary hover:bg-primary hover:text-white text-primary font-bold uppercase tracking-wider text-sm rounded-none transition-colors duration-300 mt-auto"
            >
              Get Started
            </button>
          </div>

          {/* Premium / Best Value */}
          <div className="bg-primary rounded-none p-8 border-t-8 border-accent shadow-2xl flex flex-col relative transform lg:-translate-y-4 transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-6 py-2 rounded-none text-xs font-bold tracking-widest uppercase whitespace-nowrap">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-playfair">Premium</h3>
            <p className="text-white/70 mb-6 min-h-[48px]">Maximum value for serious learners.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">$120</span>
              <span className="text-white/70"> / month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow font-medium">
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-accent" size={18} /> 12 Classes / Month
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-accent" size={18} /> $10 per class
              </li>
              <li className="flex items-center gap-3 text-accent font-bold">
                <CheckCircle2 className="text-accent" size={18} /> Save 33%
              </li>
            </ul>
            <button
              disabled={isProcessing}
              onClick={() => handlePayment(120, 'Premium Package')}
              className="w-full py-5 px-6 bg-accent hover:bg-white hover:text-primary text-white font-bold uppercase tracking-wider text-sm rounded-none transition-all duration-300 mt-auto"
            >
              Choose Premium
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}