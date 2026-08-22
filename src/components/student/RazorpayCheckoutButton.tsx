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

export default function RazorpayCheckoutButton({ amount, packageId, label }: { amount: number, packageId: string, label: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        body: JSON.stringify({ amount, packageId }),
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
          toast.loading("Verifying payment...");
          
          // 4. Verify payment on backend
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              packageId,
            }),
          });
          
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            toast.success("Payment successful! Your package is active.");
            router.refresh();
          } else {
            toast.error(verifyData.error || "Payment verification failed.");
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
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="w-full py-4 bg-white text-primary hover:bg-accent hover:text-white font-bold uppercase tracking-widest text-xs transition-colors relative z-10 rounded-2xl shadow-lg border border-transparent hover:border-accent disabled:opacity-50"
    >
      {loading ? "Processing..." : label}
    </button>
  );
}

// Add TS declaration for window.Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
