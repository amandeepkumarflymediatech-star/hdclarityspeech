import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hdclarity.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@hdclarity.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Create Tutors
  const tutor1 = await prisma.user.upsert({
    where: { email: 'tutor1@hdclarity.com' },
    update: { 
      password: hashedPassword,
      isApproved: true,
      bio: 'Expert in corporate communications and accent neutralization with over 10 years of experience.',
      experience: '10+ years coaching Fortune 500 executives.',
      languages: 'English, Spanish',
      image: '/tutor-1.jpg',
    },
    create: {
      email: 'tutor1@hdclarity.com',
      name: 'Sarah Tutor',
      password: hashedPassword,
      role: 'TUTOR',
      isApproved: true,
      bio: 'Expert in corporate communications and accent neutralization with over 10 years of experience.',
      experience: '10+ years coaching Fortune 500 executives.',
      languages: 'English, Spanish',
      image: '/tutor-1.jpg',
    },
  });

  const tutor2 = await prisma.user.upsert({
    where: { email: 'tutor2@hdclarity.com' },
    update: { 
      password: hashedPassword,
      isApproved: true,
      bio: 'Specializes in public speaking, stage presence, and overcoming speech anxiety.',
      experience: '7 years as a professional speaker and vocal coach.',
      languages: 'English, French',
      image: '/tutor-2.jpg',
    },
    create: {
      email: 'tutor2@hdclarity.com',
      name: 'John Tutor',
      password: hashedPassword,
      role: 'TUTOR',
      isApproved: true,
      bio: 'Specializes in public speaking, stage presence, and overcoming speech anxiety.',
      experience: '7 years as a professional speaker and vocal coach.',
      languages: 'English, French',
      image: '/tutor-2.jpg',
    },
  });

  // 3. Create Student and Subscription
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: { password: hashedPassword },
    create: {
      email: 'student@example.com',
      name: 'Alice Student',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  // 4. Create Reviews
  const review1 = await (prisma as any).review.create({
    data: {
      studentId: student.id,
      tutorId: tutor1.id,
      rating: 5,
      content: 'The 1:1 sessions completely changed my approach. I gained confidence in just 3 weeks!',
    }
  });

  const review2 = await (prisma as any).review.create({
    data: {
      studentId: student.id,
      tutorId: tutor2.id,
      rating: 5,
      content: 'Flexible scheduling allowed me to learn while working full time. Highly recommend to everyone.',
    }
  });

  console.log({ admin, tutor1, tutor2, student, review1, review2 });
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
