"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSessionFromCalendly(tutorId: string, eventUri: string, inviteeUri: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    throw new Error("Unauthorized");
  }

  // To properly integrate, we would usually fetch the event details from Calendly API here
  // using the eventUri to get the exact start/end times.
  // For now, since everything is dynamic and we don't have the Calendly PAT on the backend yet,
  // we will create a placeholder Session or fetch it if we configure the PAT later.
  
  // As a quick fallback to ensure the DB record exists:
  // We'll create a mock booking and session so it appears on the appointments page.
  // In a full production setup with Calendly API, we would `fetch(eventUri, { headers: { Authorization: Bearer TOKEN } })`
  
  // First ensure there is a SessionType for this (defaulting to the first available or creating one)
  let sessionType = await prisma.sessionType.findFirst({
    where: { isActive: true }
  });
  
  if (!sessionType) {
    sessionType = await prisma.sessionType.create({
      data: {
        name: "Standard Therapy Session",
        durationMinutes: 60,
        basePrice: 100,
        isActive: true,
      }
    });
  }

  // Create a booking record
  const booking = await prisma.booking.create({
    data: {
      studentId: session.user.id,
      tutorId,
      sessionTypeId: sessionType.id,
      status: "SCHEDULED" // Skipping payment for this dynamic demo
    }
  });

  // Create the session
  await prisma.session.create({
    data: {
      bookingId: booking.id,
      tutorId,
      studentId: session.user.id,
      calendlyEventUri: eventUri,
      calendlyInviteeUri: inviteeUri,
      scheduledAt: new Date(Date.now() + 86400000), // Mock tomorrow
      endTime: new Date(Date.now() + 90000000),     // Mock +1 hr
      status: "SCHEDULED",
    }
  });

  // Deduct from active package if available
  const activePackage = await prisma.studentPackage.findFirst({
    where: { studentId: session.user.id, status: "ACTIVE" }
  });

  if (activePackage && activePackage.remainingSessions > 0) {
    await prisma.studentPackage.update({
      where: { id: activePackage.id },
      data: { remainingSessions: activePackage.remainingSessions - 1 }
    });
  }

  revalidatePath("/student/appointments");
  revalidatePath("/tutor/appointments");
  
  return { success: true };
}
