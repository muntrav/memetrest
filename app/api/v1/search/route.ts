import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { postsService } from "@/lib/posts/service";
import {
  parseLimit,
  parseOptionalCursor,
  parseSearchQuery,
  parseSearchTab
} from "@/lib/posts/validation";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const viewer = await authService.getCurrentSession(request).catch(() => null);
    const result = await postsService.search({
      viewerUserId: viewer?.user.id,
      tab: parseSearchTab(searchParams.get("tab") ?? undefined),
      queryText: parseSearchQuery(searchParams.get("q") ?? undefined),
      limit: parseLimit(searchParams.get("limit") ?? undefined),
      cursor: parseOptionalCursor(searchParams.get("cursor") ?? undefined)
    });

    return Response.json(result);
  } catch (error) {
    return mapApiError(error);
  }
}
