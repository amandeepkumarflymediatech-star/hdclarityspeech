"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createSubscription(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const userId = formData.get("userId") as string;
  const planType = formData.get("planType") as string;
  const status = formData.get("status") as string;

  const packageDetails: Record<string, { price: number, totalSessions: number, validityDays: number }> = {
    "Single Class": { price: 15, totalSessions: 1, validityDays: 30 },
    "Starter": { price: 60, totalSessions: 4, validityDays: 30 },
    "Standard": { price: 96, totalSessions: 8, validityDays: 30 },
    "Premium": { price: 120, totalSessions: 12, validityDays: 30 },
  };

  const details = packageDetails[planType] || packageDetails["Starter"];

  let dbPackage = await prisma.package.findFirst({ where: { name: planType } });
  if (!dbPackage) {
    dbPackage = await prisma.package.create({
      data: {
        name: planType,
        price: details.price,
        totalSessions: details.totalSessions,
        validityDays: details.validityDays,
      }
    });
  }

  await prisma.studentPackage.create({
    data: {
      studentId: userId,
      packageId: dbPackage.id,
      totalSessions: dbPackage.totalSessions,
      remainingSessions: dbPackage.totalSessions,
      expiresAt: new Date(Date.now() + dbPackage.validityDays * 24 * 60 * 60 * 1000),
      status: status
    }
  });

  revalidatePath("/admin/subscriptions");
}

export async function updateSubscription(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const planType = formData.get("planType") as string;
  const status = formData.get("status") as string;

  const packageDetails: Record<string, { price: number, totalSessions: number, validityDays: number }> = {
    "Single Class": { price: 15, totalSessions: 1, validityDays: 30 },
    "Starter": { price: 60, totalSessions: 4, validityDays: 30 },
    "Standard": { price: 96, totalSessions: 8, validityDays: 30 },
    "Premium": { price: 120, totalSessions: 12, validityDays: 30 },
  };
  const details = packageDetails[planType] || packageDetails["Starter"];

  let dbPackage = await prisma.package.findFirst({ where: { name: planType } });
  if (!dbPackage) {
    dbPackage = await prisma.package.create({
      data: {
        name: planType,
        price: details.price,
        totalSessions: details.totalSessions,
        validityDays: details.validityDays,
      }
    });
  }

  const existingPackage = await prisma.studentPackage.findUnique({ where: { id } });
  if (existingPackage) {
    await prisma.studentPackage.update({
      where: { id },
      data: {
        packageId: dbPackage.id,
        status: status,
      }
    });
  }

  revalidatePath("/admin/subscriptions");
}

export async function deleteSubscription(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.studentPackage.delete({
    where: { id }
  });

  revalidatePath("/admin/subscriptions");
}

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as any;
  const password = formData.get("password") as string;

  if (!email || !password || !role) {
    throw new Error("Missing required fields");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashedPassword,
    }
  });

  revalidatePath("/admin/users");
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as any;
  const password = formData.get("password") as string;

  if (!email || !role) {
    throw new Error("Missing required fields");
  }

  const data: any = { name, email, role };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id }
  });

  revalidatePath("/admin/users");
}

export async function approveTutor(id: string, isApproved: boolean) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id },
    data: { isApproved }
  });

  revalidatePath("/admin/tutors");
}
