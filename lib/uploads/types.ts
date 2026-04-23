export const imageUploadContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
] as const;

export type ImageUploadContentType = (typeof imageUploadContentTypes)[number];

export type ImageUploadIntentInput = {
  filename: string;
  contentType: ImageUploadContentType;
  sizeBytes: number;
  checksumSha256?: string;
};

export type ImageUploadIntent = {
  tempAssetKey: string;
  uploadUrl: string;
  uploadMethod: "PUT";
  uploadHeaders: Record<string, string>;
  expiresAt: string;
};

export type CreatePostInput = {
  caption: string;
  overlayTextTop?: string;
  overlayTextBottom?: string;
  tags?: string[];
  visibility?: "public" | "private";
  tempAssetKey: string;
};

export type TempImageUpload = {
  id: string;
  ownerUserId: string;
  storageProvider: string;
  bucketName: string;
  storageKey: string;
  originalFilename: string;
  contentType: ImageUploadContentType;
  sizeBytes: number;
  checksumSha256: string | null;
  status: "pending" | "uploaded" | "consumed" | "expired";
  expiresAt: string;
  uploadedAt: string | null;
  consumedAt: string | null;
};

export type StoredImageMetadata = {
  publicUrl: string;
  storageKey: string;
  sizeBytes: number;
  width: number;
  height: number;
  mimeType: ImageUploadContentType;
  checksumSha256: string;
};
