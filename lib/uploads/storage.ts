import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { imageSize } from "image-size";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  getUploadsBucketName
} from "@/lib/infrastructure/config/env";
import { ApiError } from "@/lib/shared/api-error";
import type {
  ImageUploadContentType,
  StoredImageMetadata
} from "@/lib/uploads/types";

const uploadExpiryMs = 2 * 60 * 60 * 1000;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

let bucketEnsured = false;

function getAdminClient() {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function ensureBucketExists() {
  if (bucketEnsured) {
    return;
  }

  const supabase = getAdminClient();
  const bucketName = getUploadsBucketName();
  const { data, error } = await supabase.storage.getBucket(bucketName);

  if (error) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes
    });

    if (createError && !createError.message.toLowerCase().includes("duplicate")) {
      throw new Error(`Unable to create uploads bucket: ${createError.message}`);
    }
  } else if (
    !data.public ||
    JSON.stringify(data.allowed_mime_types ?? []) !== JSON.stringify(allowedMimeTypes) ||
    Number(data.file_size_limit ?? 0) !== 10 * 1024 * 1024
  ) {
    const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes
    });

    if (updateError) {
      throw new Error(`Unable to update uploads bucket: ${updateError.message}`);
    }
  }

  bucketEnsured = true;
}

export function createTempObjectPath(input: {
  userId: string;
  tempAssetKey: string;
  contentType: ImageUploadContentType;
}): string {
  const extension =
    input.contentType === "image/jpeg"
      ? "jpg"
      : input.contentType === "image/png"
        ? "png"
        : "webp";

  return `temp/${input.userId}/${input.tempAssetKey}.${extension}`;
}

export const uploadsStorage = {
  getUploadExpiry(now = new Date()) {
    return new Date(now.getTime() + uploadExpiryMs);
  },

  async createSignedImageUpload(input: {
    objectPath: string;
    contentType: ImageUploadContentType;
  }) {
    await ensureBucketExists();
    const supabase = getAdminClient();
    const bucketName = getUploadsBucketName();
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(input.objectPath);

    if (error || !data) {
      throw new Error(`Unable to create signed upload URL: ${error?.message ?? "unknown error"}`);
    }

    return {
      bucketName,
      signedUrl: data.signedUrl,
      expiresAt: this.getUploadExpiry().toISOString(),
      headers: {
        "content-type": input.contentType
      }
    };
  },

  async inspectStoredImage(input: {
    storageKey: string;
    contentType: ImageUploadContentType;
  }): Promise<StoredImageMetadata> {
    await ensureBucketExists();
    const supabase = getAdminClient();
    const bucketName = getUploadsBucketName();
    const { data: blob, error } = await supabase.storage.from(bucketName).download(input.storageKey);

    if (error || !blob) {
      throw new ApiError(422, "VALIDATION_ERROR", "Uploaded image could not be found.", {
        field: "asset.tempAssetKey"
      });
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dimensions = imageSize(buffer);

    if (!dimensions.width || !dimensions.height) {
      throw new ApiError(422, "VALIDATION_ERROR", "Uploaded image dimensions could not be determined.", {
        field: "asset.tempAssetKey"
      });
    }

    const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(input.storageKey);

    return {
      publicUrl: publicData.publicUrl,
      storageKey: input.storageKey,
      sizeBytes: buffer.byteLength,
      width: dimensions.width,
      height: dimensions.height,
      mimeType: input.contentType,
      checksumSha256: createHash("sha256").update(buffer).digest("hex")
    };
  }
};
