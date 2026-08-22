"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveCalendlyUrl(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TUTOR") {
    throw new Error("Unauthorized");
  }

  const schedulingUrl = formData.get("schedulingUrl") as string;
  
  if (!schedulingUrl || !schedulingUrl.includes("calendly.com/")) {
    throw new Error("Please provide a valid Calendly URL.");
  }

  // Update or create CalendlyConnection
  await prisma.calendlyConnection.upsert({
    where: { tutorId: session.user.id },
    update: { schedulingUrl, isActive: true },
    create: {
      tutorId: session.user.id,
      schedulingUrl,
      isActive: true,
    }
  });

  revalidatePath("/tutor/settings");
  return { success: true };
}
