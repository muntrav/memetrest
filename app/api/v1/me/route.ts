import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authService } from "@/lib/auth/service";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authSession = await authService.getCurrentSession(request);
    return NextResponse.json(authSession);
  } catch (error) {
    return mapApiError(error);
  }
}
