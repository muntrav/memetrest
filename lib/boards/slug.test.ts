import { describe, expect, it } from "vitest";
import { createBoardSlugBase, createBoardSlugCandidate } from "@/lib/boards/slug";

describe("board slug generation", () => {
  it("creates a clean slug base from a board name", () => {
    expect(createBoardSlugBase("  Reaction Vault 2026! ")).toBe("reaction-vault-2026");
  });

  it("falls back to board when the name has no slug content", () => {
    expect(createBoardSlugBase("!!!")).toBe("board");
  });

  it("adds a numeric suffix for subsequent attempts", () => {
    expect(createBoardSlugCandidate("Reaction Vault", 2)).toBe("reaction-vault-3");
  });
});
