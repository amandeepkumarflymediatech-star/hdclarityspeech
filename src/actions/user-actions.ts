"use server"

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email }
  });

  revalidatePath("/student/settings");
  revalidatePath("/tutor/settings");
  revalidatePath("/admin/settings");
}
