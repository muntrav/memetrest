import { createHash, randomBytes } from "node:crypto";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { getSessionCookieName } from "@/lib/infrastructure/config/env";

export const sessionDurationMs = 1000 * 60 * 60 * 24 * 30;
export const passwordResetDurationMs = 1000 * 60 * 30;

export function createOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionExpiry(now = new Date()): Date {
  return new Date(now.getTime() + sessionDurationMs);
}

export function createPasswordResetExpiry(now = new Date()): Date {
  return new Date(now.getTime() + passwordResetDurationMs);
}

export function getSessionCookieOptions(expires: Date): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires
  };
}

export function getExpiredSessionCookieOptions(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0
  };
}

export function sessionCookieName(): string {
  return getSessionCookieName();
}
