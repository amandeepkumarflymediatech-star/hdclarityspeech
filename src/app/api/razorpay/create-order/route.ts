import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, packageId } = await req.json();

    const conversionRate = 80; // $1 USD = ₹80 INR approx

    const order = await razorpay.orders.create({
      amount: amount * conversionRate * 100, // Convert USD to INR and then to paise
      currency: "INR", 
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        packageId: packageId,
      },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
