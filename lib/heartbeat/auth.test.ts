import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  assertHeartbeatAuthorized,
  extractHeartbeatToken
} from "@/lib/heartbeat/auth";
import { ApiError } from "@/lib/shared/api-error";

function createRequest(headers: Record<string, string>) {
  return new NextRequest("http://localhost:3000/api/internal/heartbeat", {
    method: "POST",
    headers
  });
}

describe("heartbeat auth", () => {
  it("extracts bearer tokens", () => {
    const request = createRequest({
      authorization: "Bearer heartbeat-secret"
    });

    expect(extractHeartbeatToken(request)).toBe("heartbeat-secret");
  });

  it("authorizes matching tokens", () => {
    vi.stubEnv("HEARTBEAT_TOKEN", "heartbeat-secret");
    const request = createRequest({
      "x-heartbeat-token": "heartbeat-secret"
    });

    expect(() => assertHeartbeatAuthorized(request)).not.toThrow();
    vi.unstubAllEnvs();
  });

  it("rejects missing or invalid tokens", () => {
    vi.stubEnv("HEARTBEAT_TOKEN", "heartbeat-secret");

    expect(() => assertHeartbeatAuthorized(createRequest({}))).toThrow(ApiError);
    expect(() =>
      assertHeartbeatAuthorized(
        createRequest({
          authorization: "Bearer wrong-secret"
        })
      )
    ).toThrow(ApiError);

    vi.unstubAllEnvs();
  });
});
