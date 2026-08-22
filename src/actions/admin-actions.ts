"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createSubscription(formData: FormData) {
  throw new Error("Subscription system is being upgraded. Please manage packages from the Packages tab.");
}

export async function updateSubscription(id: string, formData: FormData) {
  throw new Error("Subscription system is being upgraded. Please manage packages from the Packages tab.");
}

export async function deleteSubscription(id: string) {
  throw new Error("Subscription system is being upgraded. Please manage packages from the Packages tab.");
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
