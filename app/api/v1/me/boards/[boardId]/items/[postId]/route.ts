import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { boardsService } from "@/lib/boards/service";
import { assertUuid } from "@/lib/boards/validation";
import { routes } from "@/lib/routes";
import { mapApiError } from "@/lib/shared/api-error";
import { noContent } from "@/lib/shared/http";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    boardId: string;
    postId: string;
  }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const { boardId, postId } = await context.params;
    await boardsService.removePostFromBoard(
      authSession.user.id,
      assertUuid(boardId, "boardId"),
      assertUuid(postId, "postId")
    );

    revalidatePath(routes.collections);
    revalidatePath(routes.home);
    revalidatePath(routes.search);

    return noContent();
  } catch (error) {
    return mapApiError(error);
  }
}
