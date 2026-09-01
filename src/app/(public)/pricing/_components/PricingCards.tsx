'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Script from 'next/script';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Package } from '@prisma/client';

export default function PricingCards({ packages }: { packages: any[] }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePayment = async (amount: number, planName: string) => {
    if (status === 'unauthenticated' || !session) {
      router.push('/login');
      return;
    }

    setIsProcessing(true);

    if (!(window as any).Razorpay) {
      Swal.fire('Error', 'Razorpay SDK failed to load. Are you online?', 'error');
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      if (!res.ok) {
        throw new Error(order.error || 'Failed to create order');
      }

      const options = {
        key: order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: 'HD Clarity Speech',
        description: `Purchase: ${planName}`,
        order_id: order.id,
        handler: function (response: any) {
          Swal.fire('Success', `Payment Successful! Payment ID: ${response.razorpay_payment_id}`, 'success');
        },
        prefill: {
          name: session?.user?.name || 'Student Name',
          email: session?.user?.email || 'student@example.com',
        },
        theme: {
          color: '#2563EB'
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

  if (!packages || packages.length === 0) {
    return <div className="text-center py-10">No pricing plans available at the moment.</div>;
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center gap-6 md:gap-8">
        {packages.map((pkg) => {
          const isPopular = pkg.isPopular;
          let features: string[] = [];
          try {
            if (pkg.features) features = JSON.parse(pkg.features);
          } catch (e) {
            console.error('Failed to parse features for package', pkg.id);
          }

          return (
            <div 
              key={pkg.id}
              className={`w-full sm:w-[calc(50%-12px)] md:w-[calc(50%-16px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-24px)] max-w-sm rounded-3xl p-8 flex flex-col transition-all duration-300 relative ${
                isPopular 
                  ? 'bg-primary border-t-8 border-accent shadow-2xl lg:-translate-y-4' 
                  : 'bg-white border border-secondary/20 shadow-sm hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase whitespace-nowrap shadow-md">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className={`text-2xl font-bold mb-2 font-playfair ${isPopular ? 'text-white' : 'text-primary'}`}>
                {pkg.name}
              </h3>
              
              <p className={`mb-6 min-h-[48px] ${isPopular ? 'text-white/70' : 'text-primary/70'}`}>
                {pkg.description}
              </p>
              
              <div className="mb-6">
                <span className={`text-4xl font-black ${isPopular ? 'text-white' : 'text-primary'}`}>
                  ${pkg.price}
                </span>
                {pkg.totalSessions > 1 && (
                   <span className={isPopular ? 'text-white/70' : 'text-primary/70'}> / month</span>
                )}
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow font-medium">
                {features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-3 ${isPopular ? 'text-white' : 'text-primary'}`}>
                    <CheckCircle2 className="text-accent" size={18} /> {feature}
                  </li>
                ))}
              </ul>
              
              <button
                disabled={isProcessing}
                onClick={() => handlePayment(pkg.price, pkg.name)}
                className={`w-full py-4 px-6 font-bold uppercase tracking-wider text-sm rounded-xl mt-auto transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                  isPopular
                    ? 'bg-accent hover:bg-white hover:text-primary text-white py-4.5'
                    : 'bg-secondary/20 hover:bg-primary hover:text-white text-primary'
                }`}
              >
                {isPopular ? 'Choose Premium' : 'Get Started'}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
