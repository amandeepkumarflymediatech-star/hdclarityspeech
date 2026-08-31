import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendContactUserConfirmation, sendContactAdminNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, studyPreference, message } = body;

    if (!name || !email || !studyPreference || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        studyPreference,
        message,
      },
    });

    // Send email notifications (non-blocking)
    Promise.all([
      sendContactUserConfirmation(email),
      sendContactAdminNotification({ name, email, studyPreference, message })
    ]).catch(err => console.error("Failed to send contact emails", err));

    return NextResponse.json({ success: true, contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your message.' },
      { status: 500 }
    );
  }
}
