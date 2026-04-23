import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { mapApiError } from "@/lib/shared/api-error";
import { noContentAndClearSession } from "@/lib/shared/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await authService.logout(request);
    return noContentAndClearSession();
  } catch (error) {
    return mapApiError(error);
  }
}
