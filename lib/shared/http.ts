import { NextResponse } from "next/server";
import {
  getExpiredSessionCookieOptions,
  getSessionCookieOptions,
  sessionCookieName
} from "@/lib/auth/session";

export function jsonCreatedWithSession<T>(body: T, rawToken: string, expiresAt: Date): NextResponse<T> {
  const response = NextResponse.json(body, { status: 201 });
  response.cookies.set(sessionCookieName(), rawToken, getSessionCookieOptions(expiresAt));
  return response;
}

export function jsonOkWithSession<T>(body: T, rawToken: string, expiresAt: Date): NextResponse<T> {
  const response = NextResponse.json(body);
  response.cookies.set(sessionCookieName(), rawToken, getSessionCookieOptions(expiresAt));
  return response;
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function noContentAndClearSession(): NextResponse {
  const response = noContent();
  response.cookies.set(sessionCookieName(), "", getExpiredSessionCookieOptions());
  return response;
}
