import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, payload } = body;

    // We only care about invitee events
    if (event === "invitee.created") {
      const studentEmail = payload.email;
      
      // Find the student
      const student = await prisma.user.findUnique({
        where: { email: studentEmail }
      });

      if (!student) {
        console.error("Calendly Webhook: Student not found for email", studentEmail);
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
      }

      // Check for available package credit, or allow 1-time free discovery class if not yet used
      const activePackage = await prisma.studentPackage.findFirst({
        where: { studentId: student.id, status: "ACTIVE", remainingSessions: { gt: 0 } },
        orderBy: { createdAt: 'asc' }
      });

      let isDemoBooking = false;
      if (!activePackage) {
        if (!student.hasUsedDemo) {
          isDemoBooking = true;
          // Mark student as having used their 1-time discovery/demo class
          await prisma.user.update({
            where: { id: student.id },
            data: { hasUsedDemo: true, demoBookedAt: new Date() }
          });
        } else {
          console.error("Calendly Webhook: No available package and demo already used for student", student.id);
          return NextResponse.json({ message: "No balance. Free discovery class already claimed." }, { status: 400 });
        }
      } else {
        // Deduct balance
        await prisma.studentPackage.update({
          where: { id: activePackage.id },
          data: { remainingSessions: { decrement: 1 }, usedSessions: { increment: 1 } }
        });
      }

      // Find the tutor based on the scheduling link or assuming we can parse it from the payload
      // Calendly payloads for invitee don't explicitly list the tutor's email always without a sub-request, 
      // but for MVP, we'll try to find a tutor whose calendly connection matches.
      // A more robust way requires calling Calendly API with the event URI, but we can store a pending session.

      // Get a default session type (use Discovery Class if demo booking)
      let sessionTypeId = "default";
      if (isDemoBooking) {
        let demoType = await prisma.sessionType.findFirst({ where: { name: "Discovery Class" } });
        if (!demoType) {
          demoType = await prisma.sessionType.create({
            data: {
              name: "Discovery Class",
              description: "Complimentary 1-on-1 Discovery Class (One-time Demo)",
              durationMinutes: 45,
              basePrice: 0,
              isActive: true,
            }
          });
        }
        sessionTypeId = demoType.id;
      } else {
        const sessionType = await prisma.sessionType.findFirst({ where: { isActive: true }});
        sessionTypeId = sessionType?.id || "default";
      }

      // Find default tutor if possible
      const defaultTutor = await prisma.calendlyConnection.findFirst({
        where: { isActive: true }
      });
      const targetTutorId = defaultTutor?.tutorId || student.id;

      // Create a booking & session placeholder
      const booking = await prisma.booking.create({
        data: {
          studentId: student.id,
          tutorId: targetTutorId,
          sessionTypeId: sessionTypeId,
          status: "SCHEDULED",
          isDemo: isDemoBooking
        }
      });

      await prisma.session.create({
        data: {
          bookingId: booking.id,
          tutorId: targetTutorId,
          studentId: student.id,
          calendlyEventUri: payload.event,
          calendlyInviteeUri: payload.uri,
          scheduledAt: new Date(payload.tracking?.created_at || Date.now()), // Mock date for now until we fetch event details
          endTime: new Date(Date.now() + 3600000),
          status: "SCHEDULED",
          meetingUrl: payload.location?.join_url || null,
          cancelUrl: payload.cancel_url || null,
          rescheduleUrl: payload.reschedule_url || null,
          isDemo: isDemoBooking
        }
      });

      // Log transaction could go here if we tracked package transactions

      return NextResponse.json({ message: "Booking created and credit deducted" });
    }

    if (event === "invitee.canceled") {
      const inviteeUri = payload.uri;
      
      const session = await prisma.session.findUnique({
        where: { calendlyInviteeUri: inviteeUri },
        include: { booking: true }
      });

      if (session) {
        const newStatus = payload.rescheduled ? "RESCHEDULED" : "CANCELLED";
        
        await prisma.session.update({
          where: { id: session.id },
          data: { status: newStatus }
        });
        
        await prisma.booking.update({
          where: { id: session.bookingId },
          data: { status: newStatus }
        });

        // Refund the credit to active package
        const activePackage = await prisma.studentPackage.findFirst({
          where: { studentId: session.studentId, status: "ACTIVE" }
        });

        if (activePackage) {
          await prisma.studentPackage.update({
            where: { id: activePackage.id },
            data: { remainingSessions: { increment: 1 }, usedSessions: { decrement: 1 } }
          });
        }
      }
      return NextResponse.json({ message: "Booking cancelled and credit refunded" });
    }

    return NextResponse.json({ message: "Unhandled event type" });
  } catch (error) {
    console.error("Calendly Webhook Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}