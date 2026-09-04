"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function RazorpayCheckoutButton({ amount, packageId, label, variant = "default", isIndianStudent = false }: { amount: number, packageId: string, label: string, variant?: "default" | "dark", isIndianStudent?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const router = useRouter();

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }
    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setDiscountAmount(data.discountAmount);
      toast.success("Coupon applied successfully!");
    } catch (error: any) {
      setDiscountAmount(0);
      toast.error(error.message || "Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const discountedAmount = Math.max(0, amount - discountAmount);
  const gstAmount = isIndianStudent ? discountedAmount * 0.18 : 0;
  const finalAmount = discountedAmount + gstAmount;
  const appliedCoupon = discountAmount > 0 ? couponCode : undefined;

  const handleCheckout = async () => {
    setLoading(true);
    
    // 1. Load the script
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 2. Create the order on the backend
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, packageId, couponCode: appliedCoupon }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your public key
        amount: data.order.amount,
        currency: data.order.currency,
        name: "HD Clarity Speech",
        description: "Pro Plan Subscription",
        order_id: data.order.id,
        handler: async function (response: any) {
          const toastId = toast.loading("Verifying payment...");
          
          // 4. Verify payment on backend
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              packageId,
              couponCode: appliedCoupon,
            }),
          });
          
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            toast.success("Payment successful! Your package is active.", { id: toastId });
            setCouponCode("");
            setDiscountAmount(0);
            router.refresh();
          } else {
            toast.error(verifyData.error || "Payment verification failed.", { id: toastId });
          }
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: {
          color: "#0f172a", // Match your primary color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error: any) {
      toast.error("Could not initiate checkout: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Coupon Input Area */}
      <div className="flex gap-2 w-full">
        <input 
          type="text" 
          value={couponCode} 
          onChange={(e) => setCouponCode(e.target.value)} 
          placeholder="Promo code" 
          className={`flex-1 min-w-0 px-3 py-2 border rounded-xl text-sm outline-none uppercase transition-colors disabled:opacity-50 ${
            variant === 'dark'
              ? 'border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white focus:bg-white/20'
              : 'border-secondary bg-transparent text-primary focus:border-accent'
          }`}
          disabled={loading || isValidatingCoupon}
        />
        <button 
          onClick={handleApplyCoupon} 
          disabled={!couponCode || loading || isValidatingCoupon}
          className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 ${
            variant === 'dark'
              ? 'bg-white/20 text-white hover:bg-white hover:text-primary'
              : 'bg-secondary text-primary hover:bg-primary hover:text-white'
          }`}
        >
          {isValidatingCoupon ? "..." : "Apply"}
        </button>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between items-center text-sm px-1">
          <span className="text-primary/70 font-bold uppercase tracking-widest text-[10px]">Discount</span>
          <span className="text-accent font-bold">-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      {isIndianStudent && (
        <div className="flex justify-between items-center text-sm px-1">
          <span className="text-primary/70 font-bold uppercase tracking-widest text-[10px]">18% GST</span>
          <span className="text-accent font-bold">+${gstAmount.toFixed(2)}</span>
        </div>
      )}

      <button 
        onClick={handleCheckout} 
        disabled={loading}
        className="w-full py-4 bg-white text-primary hover:bg-accent hover:text-white font-bold uppercase tracking-widest text-xs transition-colors relative z-10 rounded-2xl shadow-lg border border-transparent hover:border-accent disabled:opacity-50"
      >
        {loading ? "Processing..." : `${label} - $${finalAmount.toFixed(2)}`}
      </button>
    </div>
  );
}

// Add TS declaration for window.Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
