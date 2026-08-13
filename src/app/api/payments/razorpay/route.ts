import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req: Request) {
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
    const { amount, currency = "INR" } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Razorpay works in smallest currency unit (paise)
      currency,
      receipt: `rcpt_${crypto.randomBytes(10).toString("hex")}`,
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
