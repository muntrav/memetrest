import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { boardsService } from "@/lib/boards/service";
import { getCollectionsSnapshotForViewer } from "@/lib/collections/snapshot";
import { normalizeCollectionFilter } from "@/lib/collections/types";
import { routes } from "@/lib/routes";
import { mapApiError } from "@/lib/shared/api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = normalizeCollectionFilter(searchParams.get("filter") ?? undefined);
    const snapshot = await getCollectionsSnapshotForViewer(filter);
    return NextResponse.json(snapshot);
  } catch (error) {
    return mapApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const body = (await request.json()) as {
      title?: string;
      visibility?: "public" | "private";
    };
    const board = await boardsService.createBoard(authSession.user.id, {
      name: body.title ?? "",
      visibility: body.visibility ?? "public"
    });

    revalidateTag("collections");
    revalidatePath(routes.collections);

    return NextResponse.json({ board }, { status: 201 });
  } catch (error) {
    return mapApiError(error);
  }
}
