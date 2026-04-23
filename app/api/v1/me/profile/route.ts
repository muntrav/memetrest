import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authService } from "@/lib/auth/service";
import { parseUpdateProfileInput } from "@/lib/auth/validation";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const input = parseUpdateProfileInput(await request.json());
    const authSession = await authService.updateProfile(request, input);
    return NextResponse.json({ profile: authSession.profile });
  } catch (error) {
    return mapApiError(error);
  }
}
