import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { boardsService } from "@/lib/boards/service";
import { assertUuid, parseUpdateBoardInput } from "@/lib/boards/validation";
import { routes } from "@/lib/routes";
import { mapApiError } from "@/lib/shared/api-error";
import { noContent } from "@/lib/shared/http";

export const runtime = "nodejs";

type BoardRouteContext = {
  params: Promise<{
    boardId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: BoardRouteContext) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const params = await context.params;
    const boardId = assertUuid(params.boardId, "boardId");
    const input = parseUpdateBoardInput(await request.json());
    const board = await boardsService.updateBoard(authSession.user.id, boardId, input);
    revalidatePath(routes.collections);
    return Response.json({ board });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: BoardRouteContext) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const params = await context.params;
    const boardId = assertUuid(params.boardId, "boardId");
    await boardsService.deleteBoard(authSession.user.id, boardId);
    revalidatePath(routes.collections);
    return noContent();
  } catch (error) {
    return mapApiError(error);
  }
}
