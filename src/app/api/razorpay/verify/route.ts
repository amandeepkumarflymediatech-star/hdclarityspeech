import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packageId } = body;

    // Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Payment is valid! Grant the package to the student.
    // For demo purposes, we'll ensure a generic "Pro Plan" package exists in DB
    let dbPackage = await prisma.package.findFirst({ where: { name: "Pro Plan" } });
    if (!dbPackage) {
      dbPackage = await prisma.package.create({
        data: {
          name: "Pro Plan",
          price: 99,
          totalSessions: 10,
          validityDays: 30,
        }
      });
    }

    // Create the order/payment records
    const order = await prisma.order.create({
      data: {
        studentId: session.user.id,
        packageId: dbPackage.id,
        amount: dbPackage.price,
        currency: "USD",
        status: "PAID",
      }
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        studentId: session.user.id,
        amount: dbPackage.price,
        currency: "USD",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: "PAID",
      }
    });

    // Grant the active package
    await prisma.studentPackage.create({
      data: {
        studentId: session.user.id,
        packageId: dbPackage.id,
        totalSessions: dbPackage.totalSessions,
        remainingSessions: dbPackage.totalSessions,
        expiresAt: new Date(Date.now() + dbPackage.validityDays * 24 * 60 * 60 * 1000),
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
