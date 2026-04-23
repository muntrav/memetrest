type LatestCursor = {
  kind: "latest";
  createdAt: string;
  id: string;
};

type TrendingCursor = {
  kind: "trending";
  saveCount: number;
  createdAt: string;
  id: string;
};

type CreatorsCursor = {
  kind: "creators";
  username: string;
  userId: string;
};

type TagsCursor = {
  kind: "tags";
  postCount: number;
  tag: string;
};

export type FeedCursor = LatestCursor | TrendingCursor;
export type SearchCursor = LatestCursor | CreatorsCursor | TagsCursor;

function encodeCursor<T>(cursor: T): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

function decodeCursor<T extends { kind: string }>(cursor: string): T {
  const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as T;

  if (!parsed || typeof parsed !== "object" || typeof parsed.kind !== "string") {
    throw new Error("Invalid cursor.");
  }

  return parsed;
}

export function encodeLatestCursor(createdAt: string, id: string): string {
  return encodeCursor<LatestCursor>({
    kind: "latest",
    createdAt,
    id
  });
}

export function decodeLatestCursor(cursor: string): LatestCursor {
  const parsed = decodeCursor<LatestCursor>(cursor);

  if (parsed.kind !== "latest") {
    throw new Error("Invalid cursor kind.");
  }

  return parsed;
}

export function encodeTrendingCursor(
  saveCount: number,
  createdAt: string,
  id: string
): string {
  return encodeCursor<TrendingCursor>({
    kind: "trending",
    saveCount,
    createdAt,
    id
  });
}

export function decodeTrendingCursor(cursor: string): TrendingCursor {
  const parsed = decodeCursor<TrendingCursor>(cursor);

  if (parsed.kind !== "trending") {
    throw new Error("Invalid cursor kind.");
  }

  return parsed;
}

export function encodeCreatorsCursor(username: string, userId: string): string {
  return encodeCursor<CreatorsCursor>({
    kind: "creators",
    username,
    userId
  });
}

export function decodeCreatorsCursor(cursor: string): CreatorsCursor {
  const parsed = decodeCursor<CreatorsCursor>(cursor);

  if (parsed.kind !== "creators") {
    throw new Error("Invalid cursor kind.");
  }

  return parsed;
}

export function encodeTagsCursor(postCount: number, tag: string): string {
  return encodeCursor<TagsCursor>({
    kind: "tags",
    postCount,
    tag
  });
}

export function decodeTagsCursor(cursor: string): TagsCursor {
  const parsed = decodeCursor<TagsCursor>(cursor);

  if (parsed.kind !== "tags") {
    throw new Error("Invalid cursor kind.");
  }

  return parsed;
}
