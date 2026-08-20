import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    return NextResponse.json({ success: true, contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your message.' },
      { status: 500 }
    );
  }
}
