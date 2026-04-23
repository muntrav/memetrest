import { ApiError, validationError } from "@/lib/shared/api-error";
import {
  imageUploadContentTypes,
  type CreatePostInput,
  type ImageUploadContentType,
  type ImageUploadIntentInput
} from "@/lib/uploads/types";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const tagPattern = /^[a-z0-9-]{1,32}$/;
const checksumPattern = /^[A-Fa-f0-9]{64}$/;

const maxImageUploadBytes = 10 * 1024 * 1024;

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw validationError("Request body must be an object.");
  }

  return value as Record<string, unknown>;
}

function parseTrimmedString(
  value: unknown,
  field: string,
  options?: { required?: boolean; maxLength?: number }
): string | undefined {
  if (value == null) {
    if (options?.required) {
      throw validationError(`${field} is required.`, { field });
    }

    return undefined;
  }

  if (typeof value !== "string") {
    throw validationError(`${field} must be a string.`, { field });
  }

  const trimmed = value.trim();

  if (options?.required && !trimmed) {
    throw validationError(`${field} is required.`, { field });
  }

  if (options?.maxLength && trimmed.length > options.maxLength) {
    throw validationError(`${field} must be at most ${options.maxLength} characters.`, { field });
  }

  return trimmed || undefined;
}

function parseContentType(value: unknown): ImageUploadContentType {
  if (typeof value !== "string") {
    throw validationError("contentType must be a string.", { field: "contentType" });
  }

  if (imageUploadContentTypes.includes(value as ImageUploadContentType)) {
    return value as ImageUploadContentType;
  }

  throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Only JPEG, PNG, and WebP images are supported.", {
    field: "contentType"
  });
}

function parseSizeBytes(value: unknown): number {
  if (!Number.isInteger(value) || typeof value !== "number") {
    throw validationError("sizeBytes must be an integer.", { field: "sizeBytes" });
  }

  if (value < 1) {
    throw validationError("sizeBytes must be greater than 0.", { field: "sizeBytes" });
  }

  if (value > maxImageUploadBytes) {
    throw new ApiError(413, "FILE_TOO_LARGE", `Images must be at most ${maxImageUploadBytes} bytes.`, {
      field: "sizeBytes"
    });
  }

  return value;
}

function parseChecksumSha256(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (typeof value !== "string" || !checksumPattern.test(value)) {
    throw validationError("checksumSha256 must be a 64-character hex string.", {
      field: "checksumSha256"
    });
  }

  return value.toLowerCase();
}

function parseTags(value: unknown): string[] | undefined {
  if (value == null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw validationError("tags must be an array.", { field: "tags" });
  }

  if (value.length > 10) {
    throw validationError("tags must contain at most 10 items.", { field: "tags" });
  }

  const normalized = value.map((tag, index) => {
    if (typeof tag !== "string") {
      throw validationError("tags must contain strings only.", {
        field: `tags[${index}]`
      });
    }

    const trimmed = tag.trim().toLowerCase();

    if (!tagPattern.test(trimmed)) {
      throw validationError("tags must match ^[a-z0-9-]{1,32}$.", {
        field: `tags[${index}]`
      });
    }

    return trimmed;
  });

  return [...new Set(normalized)];
}

function parseVisibility(value: unknown): "public" | "private" | undefined {
  if (value == null) {
    return undefined;
  }

  if (value === "public" || value === "private") {
    return value;
  }

  throw validationError("visibility must be public or private.", { field: "visibility" });
}

export function parseImageUploadIntentInput(value: unknown): ImageUploadIntentInput {
  const body = asRecord(value);

  return {
    filename:
      parseTrimmedString(body.filename, "filename", {
        required: true,
        maxLength: 255
      }) ?? "",
    contentType: parseContentType(body.contentType),
    sizeBytes: parseSizeBytes(body.sizeBytes),
    checksumSha256: parseChecksumSha256(body.checksumSha256)
  };
}

export function parseCreatePostInput(value: unknown): CreatePostInput {
  const body = asRecord(value);
  const asset = body.asset;

  if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
    throw validationError("asset is required.", { field: "asset" });
  }

  const tempAssetKey =
    parseTrimmedString((asset as Record<string, unknown>).tempAssetKey, "asset.tempAssetKey", {
      required: true
    }) ?? "";

  if (!uuidPattern.test(tempAssetKey)) {
    throw validationError("asset.tempAssetKey must be a valid UUID.", {
      field: "asset.tempAssetKey"
    });
  }

  return {
    caption:
      parseTrimmedString(body.caption, "caption", {
        required: true,
        maxLength: 280
      }) ?? "",
    overlayTextTop: parseTrimmedString(body.overlayTextTop, "overlayTextTop", {
      maxLength: 120
    }),
    overlayTextBottom: parseTrimmedString(body.overlayTextBottom, "overlayTextBottom", {
      maxLength: 120
    }),
    tags: parseTags(body.tags),
    visibility: parseVisibility(body.visibility),
    tempAssetKey
  };
}

export { maxImageUploadBytes };
