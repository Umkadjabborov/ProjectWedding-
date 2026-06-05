const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const halls = await prisma.hall.findMany({ select: { id: true, name: true, status: true, ownerId: true }, take: 20 });
    console.log(JSON.stringify(halls, null, 2));
  } catch (e) { console.error(e); process.exit(1); } finally { await prisma.$disconnect(); }
})();
