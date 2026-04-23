import { describe, expect, it } from "vitest";
import {
  decodeCreatorsCursor,
  decodeLatestCursor,
  decodeTagsCursor,
  decodeTrendingCursor,
  encodeCreatorsCursor,
  encodeLatestCursor,
  encodeTagsCursor,
  encodeTrendingCursor
} from "@/lib/posts/cursor";

describe("post cursors", () => {
  it("round-trips latest cursors", () => {
    const cursor = encodeLatestCursor("2026-04-23T12:00:00.000Z", "123");
    expect(decodeLatestCursor(cursor)).toEqual({
      kind: "latest",
      createdAt: "2026-04-23T12:00:00.000Z",
      id: "123"
    });
  });

  it("round-trips trending cursors", () => {
    const cursor = encodeTrendingCursor(5, "2026-04-23T12:00:00.000Z", "123");
    expect(decodeTrendingCursor(cursor)).toEqual({
      kind: "trending",
      saveCount: 5,
      createdAt: "2026-04-23T12:00:00.000Z",
      id: "123"
    });
  });

  it("round-trips creators and tags cursors", () => {
    expect(decodeCreatorsCursor(encodeCreatorsCursor("alice", "u1"))).toEqual({
      kind: "creators",
      username: "alice",
      userId: "u1"
    });
    expect(decodeTagsCursor(encodeTagsCursor(9, "reaction"))).toEqual({
      kind: "tags",
      postCount: 9,
      tag: "reaction"
    });
  });
});
