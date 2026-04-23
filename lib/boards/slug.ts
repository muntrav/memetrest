function normalizeSlugPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function createBoardSlugBase(name: string): string {
  const normalized = normalizeSlugPart(name);
  return normalized.length >= 3 ? normalized.slice(0, 64) : "board";
}

export function createBoardSlugCandidate(name: string, attempt = 0): string {
  const base = createBoardSlugBase(name);

  if (attempt === 0) {
    return base;
  }

  const suffix = `-${attempt + 1}`;
  return `${base.slice(0, Math.max(3, 64 - suffix.length))}${suffix}`;
}
