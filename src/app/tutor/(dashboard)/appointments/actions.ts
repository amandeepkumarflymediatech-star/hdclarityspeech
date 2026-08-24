'use server';

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function cancelSession(sessionId: string, reason: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TUTOR') {
    throw new Error('Unauthorized');
  }

  const existingSession = await prisma.session.findUnique({
    where: { id: sessionId }
  });

  if (!existingSession || existingSession.tutorId !== session.user.id) {
    throw new Error('Session not found or not yours to cancel');
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'CANCELLED' }
  });

  await prisma.sessionHistory.create({
    data: {
      sessionId,
      action: 'CANCELLED',
      reason,
      actorId: session.user.id
    }
  });

  revalidatePath('/tutor/appointments');
  revalidatePath('/tutor');
  return { success: true };
}
