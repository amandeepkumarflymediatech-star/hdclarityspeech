import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      action, // 'SAVE' or 'SUBMIT'
      name,
      phone,
      timezone,
      bio,
      experience,
      qualifications,
      languages,
      teachingHeadline,
      teachingLevels,
      teachingAges,
      teachingStyle,
      calendlyUrl,
    } = body;

    const onboardingStatus =
      action === "SUBMIT" ? "UNDER_REVIEW" : "IN_PROGRESS";

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        phone: phone || null,
        timezone: timezone || null,
        bio: bio || null,
        experience: experience || null,
        qualifications: qualifications || null,
        languages: languages || null,
        teachingHeadline: teachingHeadline || null,
        teachingLevels: teachingLevels || null,
        teachingAges: teachingAges || null,
        teachingStyle: teachingStyle || null,
        calendlyUrl: calendlyUrl || null,
        onboardingStatus,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error in tutor application API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
