const { Pool } = require('pg');
const tests = [
  'postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  'postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
  'postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=prefer',
  'postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=disable',
];
(async () => {
  for (const cs of tests) {
    const pool = new Pool({ connectionString: cs, ssl: { rejectUnauthorized: false } });
    try {
      console.log('TRY', cs);
      const client = await pool.connect();
      const res = await client.query('select 1');
      console.log('OK', res.rows);
      client.release();
    } catch (e) {
      console.error('ERR', e.message || e);
    } finally {
      await pool.end();
    }
  }
})();
