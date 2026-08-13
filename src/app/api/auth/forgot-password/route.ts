import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't leak whether user exists, just return success
      return NextResponse.json({ message: "If your email is registered, a reset link has been sent." }, { status: 200 });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    // Save token to DB (upsert if exists)
    await prisma.passwordResetToken.upsert({
      where: { email },
      update: {
        token,
        expires,
      },
      create: {
        email,
        token,
        expires,
      },
    });

    // Send email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ message: "Reset link sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
