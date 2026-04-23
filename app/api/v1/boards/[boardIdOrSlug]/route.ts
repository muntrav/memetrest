import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { boardsService } from "@/lib/boards/service";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

type PublicBoardRouteContext = {
  params: Promise<{
    boardIdOrSlug: string;
  }>;
};

export async function GET(request: NextRequest, context: PublicBoardRouteContext) {
  try {
    const params = await context.params;
    const viewer = await authService.getCurrentSession(request).catch(() => null);
    const board = await boardsService.getBoardDetail(
      params.boardIdOrSlug,
      viewer?.user.id
    );
    return Response.json({ board });
  } catch (error) {
    return mapApiError(error);
  }
}
