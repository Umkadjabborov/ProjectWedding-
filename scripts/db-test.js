const fs = require('fs');
const { Pool } = require('pg');

function loadEnv() {
  try {
    const env = fs.readFileSync('.env', 'utf8');
    const lines = env.split(/\r?\n/);
    const map = {};
    for (const line of lines) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*("?)(.*)\2\s*$/);
      if (m) map[m[1]] = m[3];
    }
    return map;
  } catch (e) {
    return {};
  }
}

(async () => {
  const env = loadEnv();
  const connectionString = env.DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('No DATABASE_URL found');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: (() => {
      if (!connectionString.includes('sslmode=require')) return undefined;
      try {
        const u = new URL(connectionString.replace(/^postgres:/, 'postgres:'));
        const host = u.hostname;
        return { rejectUnauthorized: false, servername: host };
      } catch (e) {
        return { rejectUnauthorized: false };
      }
    })(),
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT version(), NOW()');
    console.log('Connected OK:', res.rows[0]);
    client.release();
    await pool.end();
  } catch (e) {
    console.error('PG ERROR:');
    console.error(e);
    process.exit(1);
  }
})();
