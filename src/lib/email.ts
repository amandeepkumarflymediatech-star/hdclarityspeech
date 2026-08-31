import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"HD Clarity Speech" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-w-md mx-auto p-4 border rounded-lg">
        <h2>Reset Your Password</h2>
        <p>You recently requested to reset your password for your HD Clarity Speech account.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
}

// Utility to create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
};

const adminEmail = process.env.EMAIL_SERVER_USER;

// 1. Contact Form - User Confirmation
export async function sendContactUserConfirmation(email: string) {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"HD Clarity Speech" <${adminEmail}>`,
    to: email,
    subject: "Thank you for reaching out!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>Thank you for contacting HD Clarity Speech!</h2>
        <p>We have received your message/demo request and our team will get back to you shortly.</p>
        <p>Best regards,<br>The HD Clarity Speech Team</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

// 2. Contact Form - Admin Notification
export async function sendContactAdminNotification(contactData: { name: string, email: string, studyPreference: string, message: string }) {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"HD Clarity Speech System" <${adminEmail}>`,
    to: adminEmail,
    subject: "New Contact Form Submission",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Preference:</strong> ${contactData.studyPreference}</p>
        <p><strong>Message:</strong> ${contactData.message}</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

// 3. Tutor Application Confirmation (to Tutor)
export async function sendTutorApplicationConfirmation(email: string, name: string) {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"HD Clarity Speech" <${adminEmail}>`,
    to: email,
    subject: "Your Tutor Application has been received",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>Hi ${name},</h2>
        <p>Thank you for applying to become a tutor at HD Clarity Speech!</p>
        <p>Your application is currently under review by our administration team. We will get back to you as soon as possible.</p>
        <p>Best regards,<br>The HD Clarity Speech Team</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

// 4. Admin Alert - New Tutor Application
export async function sendAdminNewTutorAlert(tutorEmail: string, tutorName: string) {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"HD Clarity Speech System" <${adminEmail}>`,
    to: adminEmail,
    subject: "New Tutor Application Pending Review",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>New Tutor Application</h2>
        <p>A new tutor has applied and is waiting for approval.</p>
        <p><strong>Name:</strong> ${tutorName}</p>
        <p><strong>Email:</strong> ${tutorEmail}</p>
        <p>Please log in to the admin panel to review their details and CV.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

// 5. Admin Alert - New Student Registration
export async function sendAdminNewStudentAlert(studentEmail: string, studentName: string) {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"HD Clarity Speech System" <${adminEmail}>`,
    to: adminEmail,
    subject: "New Student Registration",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>New Student Registration</h2>
        <p>A new student has registered on the platform.</p>
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>Email:</strong> ${studentEmail}</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

// 6. Class Scheduled - To Student
export async function sendClassScheduledEmail(studentEmail: string, studentName: string, tutorName: string, date: string, time: string) {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"HD Clarity Speech" <${adminEmail}>`,
    to: studentEmail,
    subject: "Class Booking Confirmation",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>Booking Confirmed!</h2>
        <p>Hi ${studentName},</p>
        <p>Your class with <strong>${tutorName}</strong> has been successfully booked.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>You can view the meeting link and details in your student dashboard.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

// 7. Class Scheduled - To Tutor
export async function sendTutorClassScheduledEmail(tutorEmail: string, tutorName: string, studentName: string, date: string, time: string) {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"HD Clarity Speech System" <${adminEmail}>`,
    to: tutorEmail,
    subject: "New Class Scheduled",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>New Booking!</h2>
        <p>Hi ${tutorName},</p>
        <p>A new class has been scheduled with <strong>${studentName}</strong>.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>You can view the meeting link and details in your tutor dashboard.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}
