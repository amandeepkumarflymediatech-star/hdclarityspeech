'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Script from 'next/script';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const PricingCardItem = ({ pkg, isIndianStudent, isProcessing, handlePayment }: any) => {
  const [promoCode, setPromoCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');
    if (!promoCode) return;
    
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, amount: 100 }), // dummy amount to pass validation
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to validate coupon');
      
      setActiveCoupon(data.coupon);
      setCouponSuccess('Coupon applied!');
    } catch (err: any) {
      setCouponError(err.message);
      setActiveCoupon(null);
    }
  };

  const isPopular = pkg.isPopular;
  let features: string[] = [];
  try {
    if (pkg.features) features = JSON.parse(pkg.features);
  } catch (e) {
    console.error('Failed to parse features for package', pkg.id);
  }

  let basePrice = pkg.price;
  let discountedPrice = basePrice;
  
  if (activeCoupon) {
    if (activeCoupon.discountType === 'PERCENTAGE') {
      discountedPrice = basePrice - (basePrice * activeCoupon.discountValue) / 100;
    } else if (activeCoupon.discountType === 'FIXED_AMOUNT') {
      discountedPrice = Math.max(0, basePrice - activeCoupon.discountValue);
    }
  }

  const gstAmount = isIndianStudent ? discountedPrice * 0.18 : 0;
  const finalPrice = discountedPrice + gstAmount;

  return (
    <div 
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
        <div className="flex flex-col">
          <div className="flex items-end">
            <span className={`text-4xl font-black ${isPopular ? 'text-white' : 'text-primary'}`}>
              ${discountedPrice.toFixed(2)}
            </span>
            {pkg.totalSessions > 1 && (
               <span className={`ml-1 mb-1 ${isPopular ? 'text-white/70' : 'text-primary/70'}`}> / month</span>
            )}
          </div>
          {activeCoupon && (
            <div className={`text-sm font-medium line-through ${isPopular ? 'text-white/60' : 'text-primary/50'}`}>
              Original: ${basePrice.toFixed(2)}
            </div>
          )}
          {isIndianStudent && (
            <div className={`text-sm mt-2 font-medium ${isPopular ? 'text-white/90' : 'text-primary/80'}`}>
              + ${gstAmount.toFixed(2)} (18% GST)
              <div className="font-bold text-lg mt-1">Total: ${finalPrice.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>
      
      <ul className="space-y-4 mb-8 flex-grow font-medium">
        {features.map((feature: string, idx: number) => (
          <li key={idx} className={`flex items-center gap-3 ${isPopular ? 'text-white' : 'text-primary'}`}>
            <CheckCircle2 className="text-accent" size={18} /> {feature}
          </li>
        ))}
      </ul>
      
      <div className="mb-6 w-full">
        {!showPromo ? (
          <button 
            onClick={() => setShowPromo(true)}
            className={`text-sm font-bold transition-colors hover:underline ${isPopular ? 'text-accent hover:text-white' : 'text-primary hover:text-accent'}`}
          >
            Have a promo code?
          </button>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Promo Code" 
                className={`w-full px-3 py-2 rounded-lg text-sm border outline-none font-medium uppercase ${
                  isPopular 
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-accent' 
                    : 'bg-secondary/30 border-secondary text-primary focus:border-primary'
                }`}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              />
              <button 
                onClick={handleApplyCoupon}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  isPopular 
                    ? 'bg-accent text-white hover:bg-white hover:text-primary' 
                    : 'bg-primary text-white hover:bg-accent'
                }`}
              >
                Apply
              </button>
            </div>
            {couponSuccess && <span className="text-green-500 text-xs font-bold">{couponSuccess}</span>}
            {couponError && <span className="text-red-500 text-xs font-bold">{couponError}</span>}
          </div>
        )}
      </div>

      <button
        disabled={isProcessing}
        onClick={() => {
          handlePayment(finalPrice, pkg.name, pkg.id || 'premium-plan', activeCoupon?.code);
        }}
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
};

export default function PricingCards({ packages }: { packages: any[] }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isIndianStudent, setIsIndianStudent] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePayment = async (amount: number, planName: string, packageId: string, appliedCouponCode?: string) => {
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
        handler: async function (response: any) {
          try {
             const verifyRes = await fetch('/api/razorpay/verify', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_signature: response.razorpay_signature,
                 packageId: packageId,
                 couponCode: appliedCouponCode || null,
               })
             });
             if (verifyRes.ok) {
               Swal.fire('Success', `Payment Successful and Package Granted!`, 'success');
             } else {
               const verifyData = await verifyRes.json();
               throw new Error(verifyData.error || 'Failed to verify payment');
             }
          } catch (e: any) {
             Swal.fire('Warning', `Payment successful but verification failed: ${e.message}`, 'warning');
          }
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
      
      <div className="max-w-[1400px] mx-auto mb-10 flex flex-col md:flex-row justify-center items-center gap-6">
        <label className="flex items-center space-x-4 cursor-pointer bg-white px-6 py-4 rounded-xl shadow-sm border border-secondary/20 hover:border-primary/50 transition-colors">
          <span className="text-lg font-medium text-primary">I am an Indian student (Applies 18% GST)</span>
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              className="sr-only"
              checked={isIndianStudent}
              onChange={(e) => setIsIndianStudent(e.target.checked)}
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${isIndianStudent ? 'bg-accent' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 bg-white w-6 h-6 rounded-full transition-transform ${isIndianStudent ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </label>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center gap-6 md:gap-8">
        {packages.map((pkg) => (
          <PricingCardItem 
            key={pkg.id} 
            pkg={pkg} 
            isIndianStudent={isIndianStudent} 
            isProcessing={isProcessing} 
            handlePayment={handlePayment} 
          />
        ))}
      </div>
    </>
  );
}
