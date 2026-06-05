import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: (() => {
    const url = process.env.DATABASE_URL;
    if (!url || !url.includes("sslmode=require")) return undefined;
    try {
      const u = new URL(url.replace(/^postgres:/, "postgres:"));
      return { rejectUnauthorized: false, servername: u.hostname };
    } catch (e) {
      return { rejectUnauthorized: false };
    }
  })(),
});

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (e) {
    console.error('[DB QUERY ERROR] Could not execute query. Check DATABASE_URL and SSL settings.', e);
    throw e;
  } finally {
    client.release();
  }
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export default pool;
