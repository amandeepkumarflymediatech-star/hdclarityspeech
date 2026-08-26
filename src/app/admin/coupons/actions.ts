'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createCoupon(data: {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses?: number;
  validUntil?: Date;
}) {
  try {
    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() }
    });

    if (existing) {
      return { success: false, error: 'Coupon code already exists.' };
    }

    await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses || null,
        validUntil: data.validUntil || null,
      }
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    console.error('Error creating coupon:', error);
    return { success: false, error: 'Failed to create coupon.' };
  }
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.coupon.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status.' };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({
      where: { id }
    });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete coupon.' };
  }
}
