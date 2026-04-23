import { validationError } from "@/lib/shared/api-error";
import type {
  BoardVisibility,
  CreateBoardInput,
  UpdateBoardInput
} from "@/lib/boards/types";

const boardSlugPattern = /^[a-z0-9-]{3,64}$/;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw validationError("Request body must be a JSON object.");
  }

  return value as Record<string, unknown>;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = optionalString(record[key]);

  if (!value) {
    throw validationError(`${key} is required.`, { field: key });
  }

  return value;
}

function parseVisibility(value: unknown): BoardVisibility | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value !== "public" && value !== "private") {
    throw validationError("Visibility must be public or private.", {
      field: "visibility"
    });
  }

  return value;
}

function assertBoardName(name: string): string {
  const normalized = name.trim();

  if (normalized.length < 1 || normalized.length > 60) {
    throw validationError("Board name must be between 1 and 60 characters.", {
      field: "name"
    });
  }

  return normalized;
}

function assertBoardDescription(description: string): string {
  const normalized = description.trim();

  if (normalized.length > 160) {
    throw validationError("Description must be 160 characters or fewer.", {
      field: "description"
    });
  }

  return normalized;
}

export function assertBoardSlug(slug: string): string {
  const normalized = slug.trim().toLowerCase();

  if (!boardSlugPattern.test(normalized)) {
    throw validationError(
      "Slug must be 3-64 characters using lowercase letters, numbers, or hyphens.",
      { field: "slug" }
    );
  }

  return normalized;
}

export function assertUuid(value: string, field: string): string {
  if (!uuidPattern.test(value)) {
    throw validationError(`${field} must be a valid UUID.`, { field });
  }

  return value;
}

export function parseCreateBoardInput(body: unknown): CreateBoardInput {
  const record = asRecord(body);
  const input: CreateBoardInput = {
    name: assertBoardName(requiredString(record, "name"))
  };
  const description = optionalString(record.description);
  const visibility = parseVisibility(record.visibility);

  if (description !== undefined) {
    input.description = assertBoardDescription(description);
  }

  if (visibility !== undefined) {
    input.visibility = visibility;
  }

  return input;
}

export function parseUpdateBoardInput(body: unknown): UpdateBoardInput {
  const record = asRecord(body);
  const input: UpdateBoardInput = {};
  const name = optionalString(record.name);
  const description = optionalString(record.description);
  const visibility = parseVisibility(record.visibility);
  const slug = optionalString(record.slug);

  if (name !== undefined) {
    input.name = assertBoardName(name);
  }

  if (description !== undefined) {
    input.description = assertBoardDescription(description);
  }

  if (visibility !== undefined) {
    input.visibility = visibility;
  }

  if (slug !== undefined) {
    input.slug = assertBoardSlug(slug);
  }

  if (Object.keys(input).length === 0) {
    throw validationError("At least one board field must be supplied.");
  }

  return input;
}

export function parseBoardReorderInput(body: unknown): { boardIds: string[] } {
  const record = asRecord(body);
  const boardIds = record.boardIds;

  if (!Array.isArray(boardIds) || boardIds.length === 0) {
    throw validationError("boardIds must be a non-empty array.", {
      field: "boardIds"
    });
  }

  const normalizedBoardIds = boardIds.map((value) => {
    if (typeof value !== "string") {
      throw validationError("boardIds must contain UUID strings.", {
        field: "boardIds"
      });
    }

    return assertUuid(value, "boardIds");
  });

  const uniqueBoardIds = new Set(normalizedBoardIds);

  if (uniqueBoardIds.size !== normalizedBoardIds.length) {
    throw validationError("boardIds must not contain duplicates.", {
      field: "boardIds"
    });
  }

  return { boardIds: normalizedBoardIds };
}
