import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    // CKEditor's default simple upload adapter sends the file as 'upload'
    // For standard cover images, we might use 'file'
    const file = formData.get("upload") || formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename preserving extension
    const ext = path.extname(file.name) || ".png";
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Save the file
    fs.writeFileSync(filePath, buffer);

    // Return the public URL for the file
    const fileUrl = `/uploads/${filename}`;
    
    // CKEditor expects { url: 'string' }
    return NextResponse.json({ url: fileUrl });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
