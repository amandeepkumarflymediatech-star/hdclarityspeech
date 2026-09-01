'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getPackages() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { price: 'asc' }
    });
    return packages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

export async function createPackage(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const newPackage = await prisma.package.create({
      data: {
        name: data.name,
        description: data.description,
        features: data.features, // Should be a JSON string
        totalSessions: parseInt(data.totalSessions),
        price: parseFloat(data.price),
        discount: data.discount ? parseFloat(data.discount) : null,
        validityDays: parseInt(data.validityDays) || 30, // Default 30 days
        isActive: data.isActive,
        isPopular: data.isPopular
      } as any
    });

    revalidatePath('/pricing');
    revalidatePath('/admin/pricing');
    
    return { success: true, package: newPackage };
  } catch (error: any) {
    console.error('Error creating package:', error);
    return { success: false, error: error.message || 'Failed to create package' };
  }
}

export async function updatePackage(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        features: data.features,
        totalSessions: parseInt(data.totalSessions),
        price: parseFloat(data.price),
        discount: data.discount ? parseFloat(data.discount) : null,
        validityDays: parseInt(data.validityDays) || 30,
        isActive: data.isActive,
        isPopular: data.isPopular
      } as any
    });

    revalidatePath('/pricing');
    revalidatePath('/admin/pricing');
    
    return { success: true, package: updatedPackage };
  } catch (error: any) {
    console.error('Error updating package:', error);
    return { success: false, error: error.message || 'Failed to update package' };
  }
}

export async function deletePackage(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.package.delete({
      where: { id }
    });

    revalidatePath('/pricing');
    revalidatePath('/admin/pricing');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting package:', error);
    if (error.code === 'P2003') {
      return { 
        success: false, 
        error: 'Cannot delete this package because it has already been purchased by students or is linked to existing orders. Please edit the package and mark it as "Inactive" instead.' 
      };
    }
    return { success: false, error: error.message || 'Failed to delete package' };
  }
}
