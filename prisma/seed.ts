import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hdclarity.com' },
    update: {},
    create: {
      email: 'admin@hdclarity.com',
      name: 'Admin User',
      password: 'password123', // In a real app, hash this with bcrypt!
      role: 'ADMIN',
    },
  });

  // 2. Create Tutors
  const tutor1 = await prisma.user.upsert({
    where: { email: 'tutor1@hdclarity.com' },
    update: {},
    create: {
      email: 'tutor1@hdclarity.com',
      name: 'Sarah Tutor',
      password: 'password123',
      role: 'TUTOR',
    },
  });

  const tutor2 = await prisma.user.upsert({
    where: { email: 'tutor2@hdclarity.com' },
    update: {},
    create: {
      email: 'tutor2@hdclarity.com',
      name: 'John Tutor',
      password: 'password123',
      role: 'TUTOR',
    },
  });

  // 3. Create Student and Subscription
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Alice Student',
      password: 'password123',
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
