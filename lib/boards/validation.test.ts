import { describe, expect, it } from "vitest";
import {
  assertBoardSlug,
  assertUuid,
  parseBoardReorderInput,
  parseCreateBoardInput,
  parseUpdateBoardInput
} from "@/lib/boards/validation";

describe("boards validation", () => {
  it("parses create board input", () => {
    expect(
      parseCreateBoardInput({
        name: "Reaction Vault",
        description: "Best saves",
        visibility: "private"
      })
    ).toEqual({
      name: "Reaction Vault",
      description: "Best saves",
      visibility: "private"
    });
  });

  it("requires at least one update field", () => {
    expect(() => parseUpdateBoardInput({})).toThrow("At least one board field must be supplied.");
  });

  it("rejects duplicate board ids in reorder payload", () => {
    expect(() =>
      parseBoardReorderInput({
        boardIds: [
          "11111111-1111-4111-8111-111111111111",
          "11111111-1111-4111-8111-111111111111"
        ]
      })
    ).toThrow("boardIds must not contain duplicates.");
  });

  it("normalizes valid slugs", () => {
    expect(assertBoardSlug(" Reaction-Vault ")).toBe("reaction-vault");
  });

  it("rejects invalid uuids", () => {
    expect(() => assertUuid("not-a-uuid", "boardId")).toThrow("boardId must be a valid UUID.");
  });
});
