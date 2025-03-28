import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

export async function query<T extends QueryResultRow = Record<string, unknown>>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<QueryResultRow>(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

export async function mutate(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<QueryResult> {
  const client = await pool.connect();
  console.log({ client });
  try {
    const result = await client.query(text, params);
    return result; // Returns the number of affected rows
  } finally {
    client.release();
  }
}
