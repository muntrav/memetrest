import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { postsService } from "@/lib/posts/service";
import { assertPostId } from "@/lib/posts/validation";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

type PostRouteContext = {
  params: Promise<{
    postId: string;
  }>;
};

export async function GET(request: NextRequest, context: PostRouteContext) {
  try {
    const params = await context.params;
    const viewer = await authService.getCurrentSession(request).catch(() => null);
    const post = await postsService.getPostDetail(
      assertPostId(params.postId),
      viewer?.user.id
    );

    return Response.json({ post });
  } catch (error) {
    return mapApiError(error);
  }
}
