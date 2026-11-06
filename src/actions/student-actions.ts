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

  const tutor = await prisma.user.findUnique({ where: { id: tutorId } });
  
  // Send email notifications
  import('@/lib/email').then(({ sendClassScheduledEmail, sendTutorClassScheduledEmail }) => {
    const dateStr = startTime.toLocaleDateString();
    const timeStr = startTime.toLocaleTimeString();
    
    Promise.all([
      sendClassScheduledEmail(
        session.user.email || "", 
        session.user.name || "Student", 
        tutor?.name || "Your Tutor", 
        dateStr, 
        timeStr
      ),
      ...(tutor?.email ? [sendTutorClassScheduledEmail(
        tutor.email,
        tutor.name || "Tutor",
        session.user.name || "Student",
        dateStr,
        timeStr
      )] : [])
    ]).catch(err => console.error("Failed to send class scheduled emails", err));
  });

  revalidatePath("/student/appointments");
  revalidatePath("/tutor/appointments");
  revalidatePath("/student/subscriptions");
  revalidatePath("/student/book");
  
  return { success: true };
}

export async function getDemoEligibility() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { isLoggedIn: false, eligible: false, role: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, hasUsedDemo: true }
  });

  if (!user) {
    return { isLoggedIn: false, eligible: false, role: null };
  }

  if (user.role !== "STUDENT") {
    return { isLoggedIn: true, eligible: false, role: user.role, reason: "NOT_STUDENT", user };
  }

  if (user.hasUsedDemo) {
    return { isLoggedIn: true, eligible: false, role: "STUDENT", reason: "ALREADY_USED", user };
  }

  // Double check if any demo booking exists
  const existingBooking = await prisma.booking.findFirst({
    where: {
      studentId: user.id,
      OR: [
        { isDemo: true },
        { sessionType: { name: { in: ["Discovery Class", "Demo", "Free Demo"] } } }
      ]
    }
  });

  if (existingBooking) {
    await prisma.user.update({
      where: { id: user.id },
      data: { hasUsedDemo: true }
    });
    return { isLoggedIn: true, eligible: false, role: "STUDENT", reason: "ALREADY_USED", user };
  }

  return { isLoggedIn: true, eligible: true, role: "STUDENT", user };
}

export async function bookDiscoveryClass(eventUri: string, inviteeUri: string, preferredTutorId?: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("You must be logged in to book a Discovery Class.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || user.role !== "STUDENT") {
    throw new Error("Only students can book a Discovery Class.");
  }

  if (user.hasUsedDemo) {
    throw new Error("You have already booked your complimentary Discovery Class.");
  }

  // Check existing booking
  const existingBooking = await prisma.booking.findFirst({
    where: {
      studentId: user.id,
      OR: [
        { isDemo: true },
        { sessionType: { name: { in: ["Discovery Class", "Demo", "Free Demo"] } } }
      ]
    }
  });

  if (existingBooking) {
    await prisma.user.update({
      where: { id: user.id },
      data: { hasUsedDemo: true }
    });
    throw new Error("You have already booked your complimentary Discovery Class.");
  }

  // Resolve tutor
  let tutorId = preferredTutorId;
  let tutorConnection = null;

  if (tutorId) {
    tutorConnection = await prisma.calendlyConnection.findUnique({
      where: { tutorId }
    });
  }

  if (!tutorConnection) {
    // Find active tutor with calendly connection
    const anyActiveConnection = await prisma.calendlyConnection.findFirst({
      where: { isActive: true },
      include: { tutor: true }
    });
    if (anyActiveConnection) {
      tutorId = anyActiveConnection.tutorId;
      tutorConnection = anyActiveConnection;
    } else {
      // Find first tutor
      const anyTutor = await prisma.user.findFirst({
        where: { role: "TUTOR", isActive: true }
      });
      tutorId = anyTutor?.id || user.id;
    }
  }

  let startTime = new Date(Date.now() + 86400000);
  let endTime = new Date(Date.now() + 86400000 + 45 * 60000);
  let meetingUrl: string | null = null;

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
      }
    } catch (e) {
      console.error("Error fetching Calendly event details:", e);
    }
  }

  // Ensure Discovery Class session type exists
  let sessionType = await prisma.sessionType.findFirst({
    where: { name: "Discovery Class" }
  });

  if (!sessionType) {
    sessionType = await prisma.sessionType.create({
      data: {
        name: "Discovery Class",
        description: "Complimentary 1-on-1 Discovery Class (One-time Demo)",
        durationMinutes: 45,
        basePrice: 0,
        isActive: true,
      }
    });
  }

  // Create Booking
  const booking = await prisma.booking.create({
    data: {
      studentId: user.id,
      tutorId: tutorId!,
      sessionTypeId: sessionType.id,
      status: "SCHEDULED",
      isDemo: true
    }
  });

  // Create Session
  await prisma.session.create({
    data: {
      bookingId: booking.id,
      tutorId: tutorId!,
      studentId: user.id,
      calendlyEventUri: eventUri,
      calendlyInviteeUri: inviteeUri,
      scheduledAt: startTime,
      endTime: endTime,
      status: "SCHEDULED",
      meetingUrl: meetingUrl,
      isDemo: true
    }
  });

  // Mark user as having used their one-time demo
  await prisma.user.update({
    where: { id: user.id },
    data: {
      hasUsedDemo: true,
      demoBookedAt: new Date()
    }
  });

  const tutor = await prisma.user.findUnique({ where: { id: tutorId } });

  // Send email notifications
  import('@/lib/email').then(({ sendClassScheduledEmail, sendTutorClassScheduledEmail }) => {
    const dateStr = startTime.toLocaleDateString();
    const timeStr = startTime.toLocaleTimeString();

    Promise.all([
      sendClassScheduledEmail(
        user.email,
        user.name || "Student",
        tutor?.name || "Your Coach",
        dateStr,
        timeStr
      ),
      ...(tutor?.email ? [sendTutorClassScheduledEmail(
        tutor.email,
        tutor.name || "Tutor",
        user.name || "Student",
        dateStr,
        timeStr
      )] : [])
    ]).catch(err => console.error("Failed to send discovery class scheduled emails", err));
  });

  revalidatePath("/discovery-class");
  revalidatePath("/live-class");
  revalidatePath("/student/appointments");
  revalidatePath("/student/myClass");

  return { success: true, bookingId: booking.id };
}
