import type { Metadata } from "next";
import { BoardDetailScreen } from "@/components/screens/board-detail-screen";
import { getOptionalServerSession } from "@/lib/auth/server-session";
import { boardsService } from "@/lib/boards/service";
import { ApiError } from "@/lib/shared/api-error";

export const metadata: Metadata = {
  title: "Memetrest - Board"
};

export const dynamic = "force-dynamic";

type BoardDetailPageProps = {
  params: Promise<{
    boardIdOrSlug: string;
  }>;
};

export default async function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { boardIdOrSlug } = await params;
  const authSession = await getOptionalServerSession();

  let board = null;
  let statusTitle: string | null = null;
  let statusDescription: string | null = null;

  try {
    board = await boardsService.getBoardDetail(boardIdOrSlug, authSession?.user.id);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
      statusTitle =
        error.status === 403 ? "This board is private" : "That board could not be found";
      statusDescription = error.message;
    } else {
      throw error;
    }
  }

  return (
    <BoardDetailScreen
      board={board}
      statusDescription={statusDescription}
      statusTitle={statusTitle}
    />
  );
}
