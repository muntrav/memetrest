import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/shared/api-error";
import { parseHeartbeatPayload } from "@/lib/heartbeat/service";

describe("heartbeat payload parsing", () => {
  it("accepts empty request bodies", async () => {
    await expect(parseHeartbeatPayload("")).resolves.toEqual({});
    await expect(parseHeartbeatPayload("   ")).resolves.toEqual({});
  });

  it("accepts JSON object bodies", async () => {
    await expect(
      parseHeartbeatPayload('{"source":"github-actions","status":"ok","notes":"scheduled"}')
    ).resolves.toEqual({
      source: "github-actions",
      status: "ok",
      notes: "scheduled"
    });
  });

  it("rejects invalid JSON payloads", async () => {
    await expect(parseHeartbeatPayload("{")).rejects.toBeInstanceOf(ApiError);
    await expect(parseHeartbeatPayload("[]")).rejects.toBeInstanceOf(ApiError);
  });
});
