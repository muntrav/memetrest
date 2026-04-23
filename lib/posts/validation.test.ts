import { describe, expect, it } from "vitest";
import {
  assertPostId,
  parseFeedMode,
  parseLimit,
  parseSearchQuery,
  parseSearchTab
} from "@/lib/posts/validation";

describe("post validation", () => {
  it("parses feed mode and limit defaults", () => {
    expect(parseFeedMode(undefined)).toBe("for_you");
    expect(parseLimit(undefined)).toBe(20);
  });

  it("rejects invalid feed mode", () => {
    expect(() => parseFeedMode("random")).toThrow("mode must be one of");
  });

  it("parses search input", () => {
    expect(parseSearchTab("creators")).toBe("creators");
    expect(parseSearchQuery(" cats ")).toBe("cats");
  });

  it("rejects invalid limits and post ids", () => {
    expect(() => parseLimit("0")).toThrow("limit must be an integer between 1 and 50.");
    expect(() => assertPostId("bad")).toThrow("postId must be a valid UUID.");
  });
});
