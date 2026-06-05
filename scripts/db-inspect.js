const { Pool } = require('pg');
const url = 'postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

async function count(table) {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT count(*) AS cnt FROM ${table}`);
    return res.rows[0].cnt;
  } catch (e) {
    return `ERROR: ${e.message}`;
  } finally {
    client.release();
  }
}

async function sample(table, limit = 3) {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM ${table} LIMIT ${limit}`);
    return res.rows;
  } catch (e) {
    return `ERROR: ${e.message}`;
  } finally {
    client.release();
  }
}

(async () => {
  const tables = ['halls', 'users', 'bookings', 'cars', 'singers', 'menu_items', 'hall_images'];
  for (const table of tables) {
    const cnt = await count(table);
    console.log(`${table}: ${cnt}`);
  }

  console.log('\n--- SAMPLE HALLS ---');
  console.log(await sample('halls'));

  console.log('\n--- SAMPLE USERS ---');
  console.log(await sample('users'));

  await pool.end();
})();
