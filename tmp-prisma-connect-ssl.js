const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const urls = [
  'postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=prefer',
  'postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
  'postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=verify-full',
];
(async () => {
  for (const url of urls) {
    process.env.DATABASE_URL = url;
    console.log('TRY', url);
    const prisma = new PrismaClient();
    try {
      await prisma.$connect();
      console.log('OK');
      await prisma.$disconnect();
    } catch (e) {
      console.error('ERR', e.message || e);
    }
  }
})();
