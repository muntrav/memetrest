import { query } from "@/lib/infrastructure/db/postgres";

export type HeartbeatRecord = {
  name: string;
  source: string;
  status: "ok" | "warning" | "error";
  notes: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
};

type HeartbeatRow = {
  name: string;
  source: string;
  status: "ok" | "warning" | "error";
  notes: string;
  last_seen_at: Date;
  created_at: Date;
  updated_at: Date;
};

function mapHeartbeatRow(row: HeartbeatRow): HeartbeatRecord {
  return {
    name: row.name,
    source: row.source,
    status: row.status,
    notes: row.notes,
    lastSeenAt: row.last_seen_at.toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

export const heartbeatRepository = {
  async touch(input: {
    name: string;
    source: string;
    status: "ok" | "warning" | "error";
    notes: string;
  }): Promise<HeartbeatRecord> {
    const result = await query<HeartbeatRow>(
      `
        insert into heartbeat (name, source, status, notes, last_seen_at, updated_at)
        values ($1, $2, $3, $4, now(), now())
        on conflict (name) do update
        set
          source = excluded.source,
          status = excluded.status,
          notes = excluded.notes,
          last_seen_at = excluded.last_seen_at,
          updated_at = excluded.updated_at
        returning name, source, status, notes, last_seen_at, created_at, updated_at
      `,
      [input.name, input.source, input.status, input.notes]
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to update heartbeat.");
    }

    return mapHeartbeatRow(row);
  }
};
