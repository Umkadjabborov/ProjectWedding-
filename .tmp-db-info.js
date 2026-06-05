const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const db = await prisma.$queryRaw`SELECT current_database() AS db, current_schema() AS schema`;
    console.log('db info', db);
    const hallCount = await prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Hall"`;
    console.log('hall count', hallCount);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
})();
