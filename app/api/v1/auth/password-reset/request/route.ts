import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { parsePasswordResetRequest } from "@/lib/auth/validation";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = parsePasswordResetRequest(await request.json());
    await authService.requestPasswordReset(input.email);
    return new Response(null, { status: 202 });
  } catch (error) {
    return mapApiError(error);
  }
}
