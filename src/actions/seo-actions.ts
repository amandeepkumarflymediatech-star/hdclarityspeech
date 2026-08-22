"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createSeo(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const pagePath = formData.get("pagePath") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const keywords = formData.get("keywords") as string;
  const ogImage = formData.get("ogImage") as string;

  await prisma.seoMetadata.create({
    data: { pagePath, title, description, keywords, ogImage }
  });

  revalidatePath("/admin/seo");
}

export async function updateSeo(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const pagePath = formData.get("pagePath") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const keywords = formData.get("keywords") as string;
  const ogImage = formData.get("ogImage") as string;

  await prisma.seoMetadata.update({
    where: { id },
    data: { pagePath, title, description, keywords, ogImage }
  });

  revalidatePath("/admin/seo");
}

export async function deleteSeo(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.seoMetadata.delete({
    where: { id }
  });

  revalidatePath("/admin/seo");
}
