'use server';

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function requestPayout() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TUTOR') {
    throw new Error('Unauthorized');
  }

  // Find all earnings available for payout
  const pendingEarnings = await prisma.tutorEarning.findMany({
    where: { 
      tutorId: session.user.id,
      status: 'AVAILABLE_FOR_PAYOUT'
    }
  });

  if (pendingEarnings.length === 0) {
    throw new Error('No earnings available for payout.');
  }

  const totalAmount = pendingEarnings.reduce((acc, curr) => acc + curr.netEarning, 0);

  // Create Payout
  const payout = await prisma.tutorPayout.create({
    data: {
      tutorId: session.user.id,
      amount: totalAmount,
      status: 'PROCESSING',
    }
  });

  // Link earnings to this payout and update their status
  await prisma.tutorEarning.updateMany({
    where: { 
      tutorId: session.user.id,
      status: 'AVAILABLE_FOR_PAYOUT'
    },
    data: {
      status: 'PAID', // Technically PROCESSING, but we mark as PAID on the earning level to lock it
      payoutId: payout.id
    }
  });

  revalidatePath('/tutor/earnings');
  return { success: true };
}
