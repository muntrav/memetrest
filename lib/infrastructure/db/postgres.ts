import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { getDatabaseUrl } from "@/lib/infrastructure/config/env";

type GlobalWithPgPool = typeof globalThis & {
  memetrestPgPool?: Pool;
};

const globalWithPgPool = globalThis as GlobalWithPgPool;

function createPool(): Pool {
  return new Pool({
    connectionString: getDatabaseUrl(),
    max: 10,
    idleTimeoutMillis: 30_000
  });
}

export function getPgPool(): Pool {
  if (!globalWithPgPool.memetrestPgPool) {
    globalWithPgPool.memetrestPgPool = createPool();
  }

  return globalWithPgPool.memetrestPgPool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  return getPgPool().query<T>(text, params);
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPgPool().connect();

  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
