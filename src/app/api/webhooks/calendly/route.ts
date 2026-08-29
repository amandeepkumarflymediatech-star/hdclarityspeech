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

      // Deduct one class credit (find first available active package)
      const activePackage = await prisma.studentPackage.findFirst({
        where: { studentId: student.id, status: "ACTIVE", remainingSessions: { gt: 0 } }
      });

      if (!activePackage) {
        console.error("Calendly Webhook: No available package for student", student.id);
        return NextResponse.json({ message: "No balance" }, { status: 400 });
      }

      // Deduct balance
      await prisma.studentPackage.update({
        where: { id: activePackage.id },
        data: { remainingSessions: { decrement: 1 }, usedSessions: { increment: 1 } }
      });

      // Find the tutor based on the scheduling link or assuming we can parse it from the payload
      // Calendly payloads for invitee don't explicitly list the tutor's email always without a sub-request, 
      // but for MVP, we'll try to find a tutor whose calendly connection matches.
      // A more robust way requires calling Calendly API with the event URI, but we can store a pending session.

      // Get a default session type (since Calendly payload doesn't map directly without setup)
      const sessionType = await prisma.sessionType.findFirst({ where: { isActive: true }});
      const sessionTypeId = sessionType?.id || "default";

      // Create a booking & session placeholder
      const booking = await prisma.booking.create({
        data: {
          studentId: student.id,
          tutorId: student.id, // HACK: We need tutor ID. In a real app, pass tutorId via UTM params from the widget!
          sessionTypeId: sessionTypeId,
          status: "SCHEDULED"
        }
      });

      await prisma.session.create({
        data: {
          bookingId: booking.id,
          tutorId: student.id, // HACK
          studentId: student.id,
          calendlyEventUri: payload.event,
          calendlyInviteeUri: payload.uri,
          scheduledAt: new Date(payload.tracking.created_at || Date.now()), // Mock date for now until we fetch event details
          endTime: new Date(Date.now() + 3600000),
          status: "SCHEDULED",
          meetingUrl: payload.location?.join_url || null,
          cancelUrl: payload.cancel_url || null,
          rescheduleUrl: payload.reschedule_url || null,
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