"use server"

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string | null;
  const imageFile = formData.get("image") as File | null;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Create a safe filename
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const fileName = `${session.user.id}-${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    imageUrl = `/uploads/${fileName}`;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      name, 
      email,
      ...(bio !== null && { bio }),
      ...(imageUrl && { image: imageUrl })
    }
  });

  revalidatePath("/student/settings");
  revalidatePath("/tutor/settings");
  revalidatePath("/tutor/profile");
  revalidatePath("/admin/settings");
}

export async function updateSecurity(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    throw new Error("Passwords are required");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || !user.password) {
    throw new Error("User not found or no password set");
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new Error("Invalid current password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  });

  revalidatePath("/student/settings");
}
