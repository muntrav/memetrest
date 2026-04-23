import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { routes } from "@/lib/routes";
import { mapApiError } from "@/lib/shared/api-error";
import { uploadsService } from "@/lib/uploads/service";
import { parseCreatePostInput } from "@/lib/uploads/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const input = parseCreatePostInput(await request.json());
    const post = await uploadsService.createPostFromTempUpload(authSession.user.id, input);

    revalidatePath(routes.home);
    revalidatePath(routes.search);
    revalidatePath(routes.profile);

    return Response.json({ post }, { status: 201 });
  } catch (error) {
    return mapApiError(error);
  }
}
