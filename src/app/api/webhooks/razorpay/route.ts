import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

// Plan mappings for package resolution
const PACKAGE_DETAILS: Record<string, { name: string; price: number; totalSessions: number; validityDays: number }> = {
  "single-class": { name: "Single Class", price: 15, totalSessions: 1, validityDays: 30 },
  "starter-plan": { name: "Starter", price: 60, totalSessions: 4, validityDays: 30 },
  "standard-plan": { name: "Standard", price: 96, totalSessions: 8, validityDays: 30 },
  "premium-plan": { name: "Premium", price: 120, totalSessions: 12, validityDays: 30 },
  "Single Class": { name: "Single Class", price: 15, totalSessions: 1, validityDays: 30 },
  "Starter": { name: "Starter", price: 60, totalSessions: 4, validityDays: 30 },
  "Standard": { name: "Standard", price: 96, totalSessions: 8, validityDays: 30 },
  "Premium": { name: "Premium", price: 120, totalSessions: 12, validityDays: 30 },
};

/**
 * Health check / verification endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Razorpay Webhook endpoint is active and listening for POST events.",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Razorpay Webhook Handler
 */
export async function POST(req: NextRequest) {
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch (err: any) {
    console.error("Razorpay Webhook: Failed to read request body", err);
    return NextResponse.json({ error: "Failed to read body" }, { status: 400 });
  }

  // 1. Signature Verification
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers.get("x-razorpay-signature");

  if (webhookSecret) {
    if (!signature) {
      console.error("Razorpay Webhook: Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Razorpay Webhook: Invalid signature match");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    console.warn("Razorpay Webhook: RAZORPAY_WEBHOOK_SECRET is not configured in environment variables. Webhook processed without signature verification.");
  }

  // 2. Parse Event Data
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch (err: any) {
    console.error("Razorpay Webhook: Invalid JSON payload", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = body?.event;
  const payload = body?.payload;

  console.log(`Razorpay Webhook received event: ${eventType}`);

  try {
    // Handle successful payment events
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload?.payment?.entity;
      const orderEntity = payload?.order?.entity;

      const razorpayOrderId = orderEntity?.id || paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;
      const notes = orderEntity?.notes || paymentEntity?.notes || {};

      let userId = notes?.userId || notes?.studentId;
      const packageId = notes?.packageId;
      const couponId = notes?.couponId;

      // Fallback: If userId not in notes, find student by email in payment entity
      if (!userId && paymentEntity?.email) {
        const student = await prisma.user.findUnique({
          where: { email: paymentEntity.email },
        });
        if (student) {
          userId = student.id;
        }
      }

      // Check for existing payment to ensure idempotency
      let existingPayment = null;
      if (razorpayOrderId || razorpayPaymentId) {
        existingPayment = await prisma.payment.findFirst({
          where: {
            OR: [
              ...(razorpayOrderId ? [{ razorpayOrderId }] : []),
              ...(razorpayPaymentId ? [{ razorpayPaymentId }] : []),
            ],
          },
          include: { order: true },
        });
      }

      if (existingPayment) {
        // If payment was pending, mark as PAID
        if (existingPayment.status !== "PAID") {
          await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
              status: "PAID",
              razorpayPaymentId: razorpayPaymentId || existingPayment.razorpayPaymentId,
            },
          });

          if (existingPayment.orderId) {
            await prisma.order.update({
              where: { id: existingPayment.orderId },
              data: { status: "PAID" },
            });
          }
        }

        // Record webhook transaction log
        try {
          await prisma.paymentTransaction.create({
            data: {
              paymentId: existingPayment.id,
              status: "PAID",
              rawData: rawBody,
            },
          });
        } catch (e) {
          console.error("Razorpay Webhook: Failed to record payment transaction log", e);
        }

        return NextResponse.json({ status: "success", message: "Payment already processed" }, { status: 200 });
      }

      // If payment record does NOT exist yet, create order and grant package
      if (userId) {
        const details = (packageId && PACKAGE_DETAILS[packageId]) || PACKAGE_DETAILS["premium-plan"];

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

        const finalAmountUSD = details.price;

        // Create Order
        const order = await prisma.order.create({
          data: {
            studentId: userId,
            packageId: dbPackage.id,
            amount: finalAmountUSD,
            currency: "USD",
            status: "PAID",
            couponId: couponId || null,
          },
        });

        // Create Payment
        const newPayment = await prisma.payment.create({
          data: {
            orderId: order.id,
            studentId: userId,
            amount: finalAmountUSD,
            currency: "USD",
            razorpayOrderId: razorpayOrderId || `order_hook_${Date.now()}`,
            razorpayPaymentId: razorpayPaymentId || `pay_hook_${Date.now()}`,
            status: "PAID",
          },
        });

        // Grant the active package to the student
        await prisma.studentPackage.create({
          data: {
            studentId: userId,
            packageId: dbPackage.id,
            totalSessions: dbPackage.totalSessions,
            remainingSessions: dbPackage.totalSessions,
            expiresAt: new Date(Date.now() + dbPackage.validityDays * 24 * 60 * 60 * 1000),
            status: "ACTIVE",
          },
        });

        // Log transaction raw payload
        try {
          await prisma.paymentTransaction.create({
            data: {
              paymentId: newPayment.id,
              status: "PAID",
              rawData: rawBody,
            },
          });
        } catch (e) {
          console.error("Razorpay Webhook: Failed to save PaymentTransaction", e);
        }

        return NextResponse.json({ status: "success", message: "Order fulfilled via webhook" }, { status: 200 });
      }

      console.warn("Razorpay Webhook: Payment captured but userId could not be identified from notes or email.");
      return NextResponse.json({ status: "success", message: "Payment recorded without user linkage" }, { status: 200 });
    }

    // Handle payment failed
    if (eventType === "payment.failed") {
      const paymentEntity = payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId || razorpayPaymentId) {
        const payment = await prisma.payment.findFirst({
          where: {
            OR: [
              ...(razorpayOrderId ? [{ razorpayOrderId }] : []),
              ...(razorpayPaymentId ? [{ razorpayPaymentId }] : []),
            ],
          },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
          });

          try {
            await prisma.paymentTransaction.create({
              data: {
                paymentId: payment.id,
                status: "FAILED",
                rawData: rawBody,
              },
            });
          } catch (e) {
            console.error("Razorpay Webhook: Failed to record failed transaction", e);
          }
        }
      }

      return NextResponse.json({ status: "success", message: "Payment failure handled" }, { status: 200 });
    }

    // For any unhandled events, acknowledge with 200 OK so Razorpay doesn't retry
    return NextResponse.json({ status: "ignored", event: eventType }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Webhook Error:", error);
    // Even if an internal error occurs, we log it and return 200 or 500
    // Returning 500 will make Razorpay retry, but if it's a persistent error, 500 would eventually cause disablement
    return NextResponse.json({ error: error.message || "Webhook processing error" }, { status: 500 });
  }
}
