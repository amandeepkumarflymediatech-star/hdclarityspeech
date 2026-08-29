'use server';

import { prisma } from "@/lib/db";

export async function cleanupPastSessions(userId?: string) {
  try {
    // Set threshold to 60 minutes ago
    const thresholdTime = new Date(Date.now() - 60 * 60 * 1000);

    const whereClause: any = {
      status: 'SCHEDULED',
      scheduledAt: { lt: thresholdTime }
    };

    if (userId) {
      whereClause.OR = [
        { studentId: userId },
        { tutorId: userId }
      ];
    }

    // Find sessions to update so we can get their booking IDs
    const pastSessions = await prisma.session.findMany({
      where: whereClause,
      select: { id: true, bookingId: true }
    });

    if (pastSessions.length === 0) {
      return { success: true, count: 0 };
    }

    const sessionIds = pastSessions.map(s => s.id);
    const bookingIds = pastSessions.map(s => s.bookingId);

    // Update the sessions to COMPLETED
    await prisma.session.updateMany({
      where: { id: { in: sessionIds } },
      data: { status: 'COMPLETED' }
    });

    // Update the related bookings to COMPLETED
    await prisma.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: { status: 'COMPLETED' }
    });

    // NOTE: In the future, this is where we can also trigger a function
    // to calculate tutor earnings for these newly completed sessions.

    return { success: true, count: pastSessions.length };
  } catch (error) {
    console.error("Failed to clean up past sessions:", error);
    return { success: false, error: "Cleanup failed" };
  }
}
