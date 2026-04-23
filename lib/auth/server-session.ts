import { cookies } from "next/headers";
import { authRepository } from "@/lib/auth/repository";
import { hashOpaqueToken, sessionCookieName } from "@/lib/auth/session";
import type { AuthSession } from "@/lib/auth/types";

export async function getOptionalServerSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(sessionCookieName())?.value;

  if (!rawToken) {
    return null;
  }

  const authSession = await authRepository.findAuthSessionByTokenHash(hashOpaqueToken(rawToken));

  if (!authSession || authSession.user.status === "banned") {
    return null;
  }

  return authSession;
}
