import { validationError } from "@/lib/shared/api-error";
import type { FeedMode, SearchTab } from "@/lib/posts/types";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function firstQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseLimit(value: string | string[] | undefined): number {
  const raw = firstQueryValue(value);

  if (!raw) {
    return 20;
  }

  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 50) {
    throw validationError("limit must be an integer between 1 and 50.", {
      field: "limit"
    });
  }

  return parsed;
}

export function parseOptionalCursor(value: string | string[] | undefined): string | undefined {
  const raw = firstQueryValue(value);
  return raw?.trim() || undefined;
}

export function parseFeedMode(value: string | string[] | undefined): FeedMode {
  const raw = firstQueryValue(value);

  if (!raw) {
    return "for_you";
  }

  if (raw === "for_you" || raw === "following" || raw === "latest" || raw === "trending") {
    return raw;
  }

  throw validationError("mode must be one of for_you, following, latest, or trending.", {
    field: "mode"
  });
}

export function parseSearchTab(value: string | string[] | undefined): SearchTab {
  const raw = firstQueryValue(value);

  if (!raw) {
    return "memes";
  }

  if (raw === "memes" || raw === "creators" || raw === "tags") {
    return raw;
  }

  throw validationError("tab must be one of memes, creators, or tags.", {
    field: "tab"
  });
}

export function parseSearchQuery(value: string | string[] | undefined): string {
  const raw = firstQueryValue(value)?.trim();

  if (!raw) {
    throw validationError("q is required.", { field: "q" });
  }

  return raw;
}

export function assertPostId(postId: string): string {
  if (!uuidPattern.test(postId)) {
    throw validationError("postId must be a valid UUID.", { field: "postId" });
  }

  return postId;
}
