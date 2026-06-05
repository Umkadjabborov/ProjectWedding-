const fs = require('fs');
const path = require('path');
const envFile = path.join(process.cwd(), '.env.local');
const env = fs.readFileSync(envFile, 'utf8');
const m = env.match(/DATABASE_URL\s*=\s*"([^"]+)"/);
if (!m) { console.error('No DATABASE_URL found in .env.local'); process.exit(1); }
process.env.DATABASE_URL = m[1];
console.log('DATABASE_URL=', process.env.DATABASE_URL);
const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const halls = await prisma.hall.findMany({ select: { id: true, name: true, status: true, ownerId: true }, take: 5 });
    console.log('HALLS', JSON.stringify(halls, null, 2));
  } catch (e) {
    console.error('ERR', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
