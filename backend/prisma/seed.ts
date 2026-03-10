import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Add your seed data here
  const user = await prisma.user.create({
    data: {
      email: 'demo@taskora.com',
      name: 'Demo User',
      password: 'demo123', // In production, hash this password!
    },
  });

  await prisma.task.create({
    data: {
      title: 'Welcome to Taskora',
      description: 'This is your first task!',
      status: 'TODO',
      priority: 'HIGH',
      userId: user.id,
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
