import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { getRequiredEnv } from "@/lib/infrastructure/config/env";
import { ApiError } from "@/lib/shared/api-error";

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function getHeartbeatToken(): string {
  return getRequiredEnv("HEARTBEAT_TOKEN");
}

export function getHeartbeatRowName(): string {
  return process.env.HEARTBEAT_ROW_NAME?.trim() || "project-keepalive";
}

export function extractHeartbeatToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  const headerToken = request.headers.get("x-heartbeat-token")?.trim();
  return headerToken || null;
}

export function assertHeartbeatAuthorized(request: NextRequest): void {
  const providedToken = extractHeartbeatToken(request);

  if (!providedToken) {
    throw new ApiError(401, "AUTH_REQUIRED", "Heartbeat token is required.");
  }

  const expectedToken = getHeartbeatToken();

  if (!safeCompare(providedToken, expectedToken)) {
    throw new ApiError(403, "FORBIDDEN", "Heartbeat token is invalid.");
  }
}
