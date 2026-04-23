import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { postsService } from "@/lib/posts/service";
import {
  parseFeedMode,
  parseLimit,
  parseOptionalCursor
} from "@/lib/posts/validation";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const viewer = await authService.getCurrentSession(request).catch(() => null);
    const result = await postsService.getFeed({
      viewerUserId: viewer?.user.id,
      mode: parseFeedMode(searchParams.get("mode") ?? undefined),
      limit: parseLimit(searchParams.get("limit") ?? undefined),
      cursor: parseOptionalCursor(searchParams.get("cursor") ?? undefined)
    });

    return Response.json({
      items: result.items,
      pageInfo: result.pageInfo
    });
  } catch (error) {
    return mapApiError(error);
  }
}
