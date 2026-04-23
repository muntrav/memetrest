import { describe, expect, it } from "vitest";
import { normalizeAuthNextPath } from "@/lib/auth/navigation";
import { routes } from "@/lib/routes";

describe("auth navigation", () => {
  it("returns the fallback for missing next paths", () => {
    expect(normalizeAuthNextPath(undefined, routes.home)).toBe(routes.home);
  });

  it("keeps valid internal next paths", () => {
    expect(normalizeAuthNextPath("/collections?filter=recent", routes.home)).toBe(
      "/collections?filter=recent"
    );
  });

  it("rejects external-looking values", () => {
    expect(normalizeAuthNextPath("//evil.example.com", routes.home)).toBe(routes.home);
    expect(normalizeAuthNextPath("https://evil.example.com", routes.home)).toBe(routes.home);
  });
});
