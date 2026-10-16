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

    const { amount, packageId, couponCode, isIndianStudent = false } = await req.json();

    const baseAmount = Number(amount) || 0;
    let finalAmount = baseAmount;
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
          finalAmount = Math.max(0, baseAmount - (baseAmount * coupon.discountValue) / 100);
        } else if (coupon.discountType === "FIXED_AMOUNT") {
          finalAmount = Math.max(0, baseAmount - coupon.discountValue);
        }
      }
    }

    // Apply GST if Indian student
    if (isIndianStudent && finalAmount > 0) {
      finalAmount = finalAmount + finalAmount * 0.18;
    }

    // If order is completely free (e.g. 100% coupon or $0 price), fulfill directly without calling Razorpay
    if (finalAmount <= 0) {
      const packageDetails = {
        "single-class": { name: "Single Class", price: 15, totalSessions: 1, validityDays: 30 },
        "starter-plan": { name: "Starter", price: 60, totalSessions: 4, validityDays: 30 },
        "standard-plan": { name: "Standard", price: 96, totalSessions: 8, validityDays: 30 },
        "premium-plan": { name: "Premium", price: 120, totalSessions: 12, validityDays: 30 },
      };

      const details = packageDetails[packageId as keyof typeof packageDetails] || packageDetails["premium-plan"];

      let dbPackage = await prisma.package.findFirst({ where: { name: details.name } });
      if (!dbPackage) {
        dbPackage = await prisma.package.create({
          data: {
            name: details.name,
            price: details.price,
            totalSessions: details.totalSessions,
            validityDays: details.validityDays,
          },
        });
      }

      const order = await prisma.order.create({
        data: {
          studentId: session.user.id,
          packageId: dbPackage.id,
          amount: 0,
          currency: "USD",
          status: "PAID",
          couponId: couponId,
        },
      });

      await prisma.payment.create({
        data: {
          orderId: order.id,
          studentId: session.user.id,
          amount: 0,
          currency: "USD",
          razorpayOrderId: `free_${Date.now()}`,
          razorpayPaymentId: `free_${Date.now()}`,
          status: "PAID",
        },
      });

      await prisma.studentPackage.create({
        data: {
          studentId: session.user.id,
          packageId: dbPackage.id,
          totalSessions: dbPackage.totalSessions,
          remainingSessions: dbPackage.totalSessions,
          expiresAt: new Date(Date.now() + dbPackage.validityDays * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
        },
      });

      if (couponId) {
        await prisma.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return NextResponse.json({ freeOrder: true, success: true });
    }

    const conversionRate = await getUsdToInrRate();

    // Razorpay minimum allowed amount for INR is ₹1.00 (100 paise)
    const amountInPaise = Math.max(100, Math.round(finalAmount * conversionRate * 100));

    const order = await razorpay.orders.create({
      amount: amountInPaise,
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
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
