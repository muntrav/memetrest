import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { boardsService } from "@/lib/boards/service";
import { parseBoardReorderInput } from "@/lib/boards/validation";
import { routes } from "@/lib/routes";
import { mapApiError } from "@/lib/shared/api-error";
import { noContent } from "@/lib/shared/http";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const { boardIds } = parseBoardReorderInput(await request.json());
    await boardsService.reorderBoards(authSession.user.id, boardIds);
    revalidatePath(routes.collections);
    return noContent();
  } catch (error) {
    return mapApiError(error);
  }
}
