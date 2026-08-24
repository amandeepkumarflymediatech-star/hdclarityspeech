"use server"

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string | null;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      name, 
      email,
      ...(bio !== null && { bio })
    }
  });

  revalidatePath("/student/settings");
  revalidatePath("/tutor/settings");
  revalidatePath("/admin/settings");
}

export async function updateSecurity(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    throw new Error("Passwords are required");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || !user.password) {
    throw new Error("User not found or no password set");
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new Error("Invalid current password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  });

  revalidatePath("/student/settings");
}
