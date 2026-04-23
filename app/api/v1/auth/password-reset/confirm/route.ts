import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { parsePasswordResetConfirm } from "@/lib/auth/validation";
import { mapApiError } from "@/lib/shared/api-error";
import { noContent } from "@/lib/shared/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = parsePasswordResetConfirm(await request.json());
    await authService.confirmPasswordReset(input.token, input.newPassword);
    return noContent();
  } catch (error) {
    return mapApiError(error);
  }
}
