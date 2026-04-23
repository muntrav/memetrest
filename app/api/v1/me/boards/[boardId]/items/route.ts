import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { boardsService } from "@/lib/boards/service";
import { assertUuid, parseSaveBoardItemInput } from "@/lib/boards/validation";
import { routes } from "@/lib/routes";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    boardId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const { boardId } = await context.params;
    const { postId } = parseSaveBoardItemInput(await request.json());
    const item = await boardsService.savePostToBoard(
      authSession.user.id,
      assertUuid(boardId, "boardId"),
      postId
    );

    revalidatePath(routes.collections);
    revalidatePath(routes.home);
    revalidatePath(routes.search);

    return Response.json({ item }, { status: 201 });
  } catch (error) {
    return mapApiError(error);
  }
}
