import { randomUUID } from "node:crypto";
import { ApiError } from "@/lib/shared/api-error";
import { postsService } from "@/lib/posts/service";
import { uploadsRepository } from "@/lib/uploads/repository";
import { createTempObjectPath, uploadsStorage } from "@/lib/uploads/storage";
import type { CreatePostInput, ImageUploadIntentInput } from "@/lib/uploads/types";

export const uploadsService = {
  async createImageUploadIntent(ownerUserId: string, input: ImageUploadIntentInput) {
    const tempAssetKey = randomUUID();
    const storageKey = createTempObjectPath({
      userId: ownerUserId,
      tempAssetKey,
      contentType: input.contentType
    });
    const upload = await uploadsStorage.createSignedImageUpload({
      objectPath: storageKey,
      contentType: input.contentType
    });
    await uploadsRepository.createTempImageUpload({
      id: tempAssetKey,
      ownerUserId,
      storageProvider: "supabase-storage",
      bucketName: upload.bucketName,
      storageKey,
      originalFilename: input.filename,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
      checksumSha256: input.checksumSha256,
      expiresAt: new Date(upload.expiresAt)
    });

    return {
      upload: {
        method: "PUT" as const,
        url: upload.signedUrl,
        headers: upload.headers,
        expiresAt: upload.expiresAt
      },
      asset: {
        tempAssetKey
      }
    };
  },

  async createPostFromTempUpload(ownerUserId: string, input: CreatePostInput) {
    const upload = await uploadsRepository.findTempImageUploadById(input.tempAssetKey);

    if (!upload || upload.ownerUserId !== ownerUserId) {
      throw new ApiError(422, "VALIDATION_ERROR", "asset.tempAssetKey is invalid.", {
        field: "asset.tempAssetKey"
      });
    }

    if (upload.status === "consumed") {
      throw new ApiError(422, "VALIDATION_ERROR", "asset.tempAssetKey has already been used.", {
        field: "asset.tempAssetKey"
      });
    }

    if (new Date(upload.expiresAt).getTime() <= Date.now()) {
      throw new ApiError(422, "VALIDATION_ERROR", "asset.tempAssetKey has expired.", {
        field: "asset.tempAssetKey"
      });
    }

    const storedAsset = await uploadsStorage.inspectStoredImage({
      storageKey: upload.storageKey,
      contentType: upload.contentType
    });

    if (upload.checksumSha256 && upload.checksumSha256 !== storedAsset.checksumSha256) {
      throw new ApiError(422, "VALIDATION_ERROR", "Uploaded image checksum does not match the declared file.", {
        field: "asset.tempAssetKey"
      });
    }

    await uploadsRepository.markTempUploadUploaded(upload.id);
    const postId = await uploadsRepository.createPostFromTempUpload({
      ownerUserId,
      post: input,
      upload,
      storedAsset
    });

    return postsService.getPostDetail(postId, ownerUserId);
  }
};
