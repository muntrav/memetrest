import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { parseSignupInput } from "@/lib/auth/validation";
import { mapApiError } from "@/lib/shared/api-error";
import { jsonCreatedWithSession } from "@/lib/shared/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = parseSignupInput(await request.json());
    const { authSession, rawToken, expiresAt } = await authService.signup(input, request);
    return jsonCreatedWithSession(authSession, rawToken, expiresAt);
  } catch (error) {
    return mapApiError(error);
  }
}
