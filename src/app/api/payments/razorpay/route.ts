import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { getUsdToInrRate } from "@/lib/exchange-rate";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payment gateway is currently unavailable. Please try again later." },
      { status: 503 }
    );
  }

  // Initialize Razorpay inside the handler
  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  try {
    const { amount, currency = "INR", packageId, couponCode } = await req.json();

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
    }

    const conversionRate = await getUsdToInrRate();
    // Razorpay minimum amount for INR is 100 paise (₹1.00)
    const amountInPaise = Math.max(100, Math.round(numericAmount * conversionRate * 100));

    const options: any = {
      amount: amountInPaise,
      currency,
      receipt: `rcpt_${crypto.randomBytes(10).toString("hex")}`,
      notes: {
        userId: session?.user?.id || "",
        packageId: packageId || "",
        couponCode: couponCode || "",
      },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ ...order, key_id: keyId }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    
    if (error.statusCode === 401) {
      return NextResponse.json(
        { error: "Payment configuration is invalid. Please check your API keys." }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
