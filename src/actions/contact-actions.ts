"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateContactStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.contactMessage.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/admin/contacts");
}

export async function deleteContact(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.contactMessage.delete({
    where: { id }
  });

  revalidatePath("/admin/contacts");
}
