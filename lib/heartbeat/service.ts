import { validationError } from "@/lib/shared/api-error";
import { getHeartbeatRowName } from "@/lib/heartbeat/auth";
import {
  heartbeatRepository,
  type HeartbeatRecord
} from "@/lib/heartbeat/repository";

type HeartbeatPayload = {
  source?: unknown;
  status?: unknown;
  notes?: unknown;
};

export async function parseHeartbeatPayload(bodyText: string): Promise<HeartbeatPayload> {
  if (!bodyText.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(bodyText) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw validationError("Heartbeat payload must be a JSON object.");
    }

    return parsed as HeartbeatPayload;
  } catch (error) {
    if (error instanceof Error && error.name === "ApiError") {
      throw error;
    }

    throw validationError("Heartbeat payload must be valid JSON.");
  }
}

export async function recordHeartbeat(bodyText: string): Promise<HeartbeatRecord> {
  const payload = await parseHeartbeatPayload(bodyText);
  const source =
    typeof payload.source === "string" && payload.source.trim()
      ? payload.source.trim()
      : "external-scheduler";
  const status =
    payload.status === "warning" || payload.status === "error" || payload.status === "ok"
      ? payload.status
      : "ok";
  const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";

  return heartbeatRepository.touch({
    name: getHeartbeatRowName(),
    source,
    status,
    notes
  });
}
