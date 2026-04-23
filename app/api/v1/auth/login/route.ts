import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { parseLoginInput } from "@/lib/auth/validation";
import { mapApiError } from "@/lib/shared/api-error";
import { jsonOkWithSession } from "@/lib/shared/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = parseLoginInput(await request.json());
    const { authSession, rawToken, expiresAt } = await authService.login(input, request);
    return jsonOkWithSession(authSession, rawToken, expiresAt);
  } catch (error) {
    return mapApiError(error);
  }
}
