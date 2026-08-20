import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
    update: { password: hashedPassword },
    create: {
      email: 'tutor1@hdclarity.com',
      name: 'Sarah Tutor',
      password: hashedPassword,
      role: 'TUTOR',
    },
  });

  const tutor2 = await prisma.user.upsert({
    where: { email: 'tutor2@hdclarity.com' },
    update: { password: hashedPassword },
    create: {
      email: 'tutor2@hdclarity.com',
      name: 'John Tutor',
      password: hashedPassword,
      role: 'TUTOR',
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
      subscriptions: {
        create: {
          planType: '3_SESSIONS',
          activeSessions: 3,
          status: 'ACTIVE'
        }
      }
    },
  });

  console.log({ admin, tutor1, tutor2, student });
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
