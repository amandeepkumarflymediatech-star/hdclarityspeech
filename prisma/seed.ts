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

  // 3. Create Student
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

  // 4. Create Standalone SessionType
  console.log('Checking for existing SessionType (Standalone)...');
  let standaloneSession = await prisma.sessionType.findFirst({
    where: { name: '1 Hour Session' }
  });

  if (!standaloneSession) {
    console.log('Creating SessionType (Standalone)...');
    standaloneSession = await prisma.sessionType.create({
      data: {
        name: '1 Hour Session',
        description: 'A 60-minute standalone 1-on-1 coaching session.',
        durationMinutes: 60,
        basePrice: 15.00,
        isActive: true,
      }
    });
  }

  // 5. Create Packages
  console.log('Checking and Creating Packages...');
  
  // Package 1: 96 USD for 8 classes (12 USD/hr)
  let package1 = await prisma.package.findFirst({ where: { name: '8 Classes / Month' } });
  if (!package1) {
    package1 = await prisma.package.create({
      data: {
        name: '8 Classes / Month',
        description: 'Get 8 classes a month with an effective rate of 12 USD/hr.',
        totalSessions: 8,
        price: 96.00,
        validityDays: 30,
        isActive: true,
        features: JSON.stringify([
          "8 Sessions included",
          "Effective rate: 12 USD/hr",
          "Valid for 1 month"
        ]),
        sessionTypes: {
          create: [
            { sessionTypeId: standaloneSession.id }
          ]
        }
      }
    });
  }

  // Package 2: 120 USD for 12 classes (10 USD/hr)
  let package2 = await prisma.package.findFirst({ where: { name: '12 Classes / Month' } });
  if (!package2) {
    package2 = await prisma.package.create({
      data: {
        name: '12 Classes / Month',
        description: 'Our best value! Get 12 classes a month with an effective rate of 10 USD/hr.',
        totalSessions: 12,
        price: 120.00,
        validityDays: 30,
        isActive: true,
        isPopular: true,
        features: JSON.stringify([
          "12 Sessions included",
          "Effective rate: 10 USD/hr",
          "Valid for 1 month"
        ]),
        sessionTypes: {
          create: [
            { sessionTypeId: standaloneSession.id }
          ]
        }
      }
    });
  }

  // Package 3: 60 USD for 4 classes (15 USD/hr)
  let package3 = await prisma.package.findFirst({ where: { name: '4 Classes / Month' } });
  if (!package3) {
    package3 = await prisma.package.create({
      data: {
        name: '4 Classes / Month',
        description: 'Get 4 classes a month with an effective rate of 15 USD/hr.',
        totalSessions: 4,
        price: 60.00,
        validityDays: 30,
        isActive: true,
        features: JSON.stringify([
          "4 Sessions included",
          "Effective rate: 15 USD/hr",
          "Valid for 1 month"
        ]),
        sessionTypes: {
          create: [
            { sessionTypeId: standaloneSession.id }
          ]
        }
      }
    });
  }

  console.log('Database seeded successfully with new packages!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
