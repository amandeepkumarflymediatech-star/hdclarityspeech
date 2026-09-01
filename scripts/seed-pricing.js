const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const packages = [
    {
      name: 'Single Class',
      description: 'Perfect for trying a class without a monthly commitment.',
      features: JSON.stringify(['1 Class', '$15 per class']),
      totalSessions: 1,
      price: 15.00,
      validityDays: 30,
      isActive: true,
      isPopular: false
    },
    {
      name: 'Starter',
      description: 'Consistent practice to get you started.',
      features: JSON.stringify(['4 Classes / Month', '$15 per class']),
      totalSessions: 4,
      price: 60.00,
      validityDays: 30,
      isActive: true,
      isPopular: false
    },
    {
      name: 'Standard',
      description: 'Accelerated progress with more sessions.',
      features: JSON.stringify(['8 Classes / Month', '$12 per class', 'Save 20%']),
      totalSessions: 8,
      price: 96.00,
      validityDays: 30,
      isActive: true,
      isPopular: false
    },
    {
      name: 'Premium',
      description: 'Maximum value for serious learners.',
      features: JSON.stringify(['12 Classes / Month', '$10 per class', 'Save 33%']),
      totalSessions: 12,
      price: 120.00,
      validityDays: 30,
      isActive: true,
      isPopular: true
    }
  ];

  console.log('Seeding packages...');
  for (const pkg of packages) {
    await prisma.package.create({ data: pkg });
  }
  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
