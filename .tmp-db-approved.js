const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const approved = await prisma.hall.findMany({
      where: { status: 'APPROVED' },
      select: { id: true, name: true, status: true },
    });
    console.log('approved count', approved.length);
    console.log(approved.map((h) => ({ id: h.id, status: h.status })));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
})();
