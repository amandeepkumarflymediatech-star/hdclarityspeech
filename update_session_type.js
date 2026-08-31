const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.sessionType.updateMany({
    where: { name: 'Upcoming Session' },
    data: { name: 'Session' }
  });
  console.log(`Updated ${result.count} session types.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
