import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { boardsService } from "@/lib/boards/service";
import { parseCreateBoardInput } from "@/lib/boards/validation";
import { routes } from "@/lib/routes";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const items = await boardsService.listOwnBoards(authSession.user.id);
    return NextResponse.json({ items });
  } catch (error) {
    return mapApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const input = parseCreateBoardInput(await request.json());
    const board = await boardsService.createBoard(authSession.user.id, input);
    revalidatePath(routes.collections);
    return NextResponse.json({ board }, { status: 201 });
  } catch (error) {
    return mapApiError(error);
  }
}
