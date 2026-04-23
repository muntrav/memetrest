import { describe, expect, it } from "vitest";
import {
  assertUsername,
  parseLoginInput,
  parseSignupInput,
  parseUpdatePrivacyInput,
  parseUpdateProfileInput
} from "@/lib/auth/validation";
import { ApiError } from "@/lib/shared/api-error";

describe("auth validation", () => {
  it("normalizes signup input", () => {
    expect(
      parseSignupInput({
        email: " USER@Example.COM ",
        password: "long-enough",
        username: "Creator_01",
        displayName: " Creator "
      })
    ).toEqual({
      email: "user@example.com",
      password: "long-enough",
      username: "creator_01",
      displayName: "Creator"
    });
  });

  it("rejects weak signup input", () => {
    expect(() =>
      parseSignupInput({
        email: "not-email",
        password: "short",
        username: "no"
      })
    ).toThrow(ApiError);
  });

  it("normalizes login input", () => {
    expect(parseLoginInput({ email: "USER@Example.COM", password: "password123" })).toEqual({
      email: "user@example.com",
      password: "password123"
    });
  });

  it("validates editable profile fields", () => {
    expect(
      parseUpdateProfileInput({
        username: "New_Name",
        displayName: "New Name",
        bio: "Mostly memes.",
        avatarUrl: "https://example.com/avatar.png"
      })
    ).toEqual({
      username: "new_name",
      displayName: "New Name",
      bio: "Mostly memes.",
      avatarUrl: "https://example.com/avatar.png"
    });
  });

  it("validates privacy visibility", () => {
    expect(parseUpdatePrivacyInput({ visibility: "private" })).toEqual({
      visibility: "private"
    });
    expect(() => parseUpdatePrivacyInput({ visibility: "friends" })).toThrow(ApiError);
  });

  it("enforces username format", () => {
    expect(assertUsername("valid_name1")).toBe("valid_name1");
    expect(() => assertUsername("Invalid-Name")).toThrow(ApiError);
  });
});
