import type { NextRequest } from "next/server";
import { authService } from "@/lib/auth/service";
import { mapApiError } from "@/lib/shared/api-error";
import { uploadsService } from "@/lib/uploads/service";
import { parseImageUploadIntentInput } from "@/lib/uploads/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const authSession = await authService.getCurrentSession(request);
    const input = parseImageUploadIntentInput(await request.json());
    const result = await uploadsService.createImageUploadIntent(authSession.user.id, input);

    return Response.json(
      {
        upload: result.upload,
        asset: result.asset
      },
      { status: 201 }
    );
  } catch (error) {
    return mapApiError(error);
  }
}
