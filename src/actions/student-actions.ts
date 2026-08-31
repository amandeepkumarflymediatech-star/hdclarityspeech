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

  // Get tutor's CalendlyConnection
  const tutorConnection = await prisma.calendlyConnection.findUnique({
    where: { tutorId }
  });

  let startTime = new Date(Date.now() + 86400000); // fallback tomorrow
  let endTime = new Date(Date.now() + 90000000); // fallback +1 hr
  let meetingUrl: string | null = null;
  
  // Try to fetch real details if access token exists
  if (tutorConnection && tutorConnection.accessToken) {
    try {
      const response = await fetch(eventUri, {
        headers: {
          'Authorization': `Bearer ${tutorConnection.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const resource = data.resource;
        
        if (resource.start_time) startTime = new Date(resource.start_time);
        if (resource.end_time) endTime = new Date(resource.end_time);
        if (resource.location && resource.location.join_url) {
          meetingUrl = resource.location.join_url;
        }
      } else {
        console.error("Failed to fetch Calendly event details:", await response.text());
      }
    } catch (error) {
      console.error("Error calling Calendly API:", error);
    }
  }

  // First ensure there is a SessionType for this (defaulting to the first available or creating one)
  let sessionType = await prisma.sessionType.findFirst({
    where: { isActive: true }
  });
  
  if (!sessionType) {
    sessionType = await prisma.sessionType.create({
      data: {
        name: "Session",
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
      scheduledAt: startTime,
      endTime: endTime,
      status: "SCHEDULED",
      meetingUrl: meetingUrl
    }
  });

  // Deduct from active package if available (oldest first)
  const activePackage = await prisma.studentPackage.findFirst({
    where: { studentId: session.user.id, status: "ACTIVE", remainingSessions: { gt: 0 } },
    orderBy: { createdAt: 'asc' }
  });

  if (activePackage && activePackage.remainingSessions > 0) {
    const newRemaining = activePackage.remainingSessions - 1;
    await prisma.studentPackage.update({
      where: { id: activePackage.id },
      data: { 
        remainingSessions: newRemaining,
        usedSessions: activePackage.usedSessions + 1,
        status: newRemaining === 0 ? "DEPLETED" : "ACTIVE"
      }
    });
  }

  revalidatePath("/student/appointments");
  revalidatePath("/tutor/appointments");
  revalidatePath("/student/subscriptions");
  revalidatePath("/student/book");
  
  return { success: true };
}
