import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  collectionsRepository,
  CollectionsValidationError
} from "@/lib/collections/repository";
import { normalizeCollectionFilter } from "@/lib/collections/types";
import { routes } from "@/lib/routes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = normalizeCollectionFilter(searchParams.get("filter") ?? undefined);
  const snapshot = await collectionsRepository.listBoards(filter);

  return NextResponse.json(snapshot);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      visibility?: "public" | "private";
    };

    const board = await collectionsRepository.createBoard({
      title: body.title ?? "",
      visibility: body.visibility
    });

    revalidateTag("collections");
    revalidatePath(routes.collections);

    return NextResponse.json({ board }, { status: 201 });
  } catch (error) {
    if (error instanceof CollectionsValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create board." }, { status: 500 });
  }
}
