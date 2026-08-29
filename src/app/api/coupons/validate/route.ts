import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, amount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "Coupon is no longer active" }, { status: 400 });
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon usage limit exceeded" }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (amount * coupon.discountValue) / 100;
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discount = coupon.discountValue;
    }

    const finalAmount = Math.max(0, amount - discount);

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      originalAmount: amount,
      discountAmount: discount,
      finalAmount: finalAmount,
    });
  } catch (error: any) {
    console.error("Coupon Validation Error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
