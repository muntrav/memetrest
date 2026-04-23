import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { assertHeartbeatAuthorized } from "@/lib/heartbeat/auth";
import { recordHeartbeat } from "@/lib/heartbeat/service";
import { mapApiError } from "@/lib/shared/api-error";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    assertHeartbeatAuthorized(request);
    const heartbeat = await recordHeartbeat(await request.text());
    return NextResponse.json({ heartbeat });
  } catch (error) {
    return mapApiError(error);
  }
}
