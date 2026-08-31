"use server";

import { prisma } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function submitTutorApplication(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const experience = formData.get("experience") as string;
  const bio = formData.get("bio") as string;
  const file = formData.get("resume") as File;

  if (!name || !email || !experience || !bio || !file) {
    throw new Error("Missing required fields");
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    if (user.role === 'TUTOR') {
      throw new Error("You have already applied or are already a tutor.");
    }
  }

  // Handle file upload
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const ext = path.extname(file.name) || '.pdf';
  const fileName = `${crypto.randomUUID()}${ext}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", "cvs", fileName);
  
  await writeFile(uploadPath, buffer);
  
  const resumeUrl = `/uploads/cvs/${fileName}`;
  const qualifications = `CV: ${resumeUrl}`;

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        role: 'TUTOR',
        onboardingStatus: 'UNDER_REVIEW',
        experience,
        bio,
        qualifications,
      }
    });
  } else {
    // If student applies to be a tutor, update their role and fields
    user = await prisma.user.update({
      where: { email },
      data: {
        role: 'TUTOR',
        onboardingStatus: 'UNDER_REVIEW',
        experience,
        bio,
        qualifications,
      }
    });
  }

  return { success: true, userId: user.id };
}
