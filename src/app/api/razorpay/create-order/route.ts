import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUsdToInrRate } from "@/lib/exchange-rate";

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

    const { amount, packageId, couponCode } = await req.json();

    let finalAmount = amount;
    let couponId = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (
        coupon &&
        coupon.isActive &&
        (!coupon.validUntil || new Date(coupon.validUntil) >= new Date()) &&
        (coupon.maxUses === null || coupon.usedCount < coupon.maxUses)
      ) {
        couponId = coupon.id;
        if (coupon.discountType === "PERCENTAGE") {
          finalAmount = amount - (amount * coupon.discountValue) / 100;
        } else if (coupon.discountType === "FIXED_AMOUNT") {
          finalAmount = Math.max(0, amount - coupon.discountValue);
        }
      }
    }

    const conversionRate = await getUsdToInrRate();

    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * conversionRate * 100), // Convert USD to INR and then to paise
      currency: "INR", 
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        packageId: packageId,
        couponId: couponId || null,
      },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
