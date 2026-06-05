const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient({ log: ['info','warn','error'] });
  try {
    const halls = await prisma.hall.findMany({ take: 5 });
    console.log('HALLS OK', halls.length);
  } catch (e) {
    console.error('ERROR', e);
  } finally {
    await prisma.$disconnect();
  }
})();
