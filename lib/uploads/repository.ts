import type { PoolClient } from "pg";
import { query, transaction } from "@/lib/infrastructure/db/postgres";
import type {
  CreatePostInput,
  StoredImageMetadata,
  TempImageUpload
} from "@/lib/uploads/types";

type TempImageUploadRow = {
  id: string;
  owner_user_id: string;
  storage_provider: string;
  bucket_name: string;
  storage_key: string;
  original_filename: string;
  content_type: TempImageUpload["contentType"];
  size_bytes: string | number;
  checksum_sha256: string | null;
  status: TempImageUpload["status"];
  expires_at: Date;
  uploaded_at: Date | null;
  consumed_at: Date | null;
};

function numberFromPg(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapTempImageUpload(row: TempImageUploadRow): TempImageUpload {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    storageProvider: row.storage_provider,
    bucketName: row.bucket_name,
    storageKey: row.storage_key,
    originalFilename: row.original_filename,
    contentType: row.content_type,
    sizeBytes: numberFromPg(row.size_bytes),
    checksumSha256: row.checksum_sha256,
    status: row.status,
    expiresAt: row.expires_at.toISOString(),
    uploadedAt: row.uploaded_at?.toISOString() ?? null,
    consumedAt: row.consumed_at?.toISOString() ?? null
  };
}

async function createPostWithAssetInTransaction(
  client: PoolClient,
  input: {
    ownerUserId: string;
    post: CreatePostInput;
    upload: TempImageUpload;
    storedAsset: StoredImageMetadata;
  }
): Promise<string> {
  const profileResult = await client.query<{ id: string }>(
    `
      select id
      from profiles
      where user_id = $1
      limit 1
    `,
    [input.ownerUserId]
  );
  const profileId = profileResult.rows[0]?.id;

  if (!profileId) {
    throw new Error("Profile not found.");
  }

  const postResult = await client.query<{ id: string }>(
    `
      insert into posts (
        author_profile_id,
        caption,
        overlay_text_top,
        overlay_text_bottom,
        visibility,
        status,
        moderation_status
      )
      values ($1, $2, $3, $4, $5, 'published', 'visible')
      returning id
    `,
    [
      profileId,
      input.post.caption,
      input.post.overlayTextTop ?? null,
      input.post.overlayTextBottom ?? null,
      input.post.visibility ?? "public"
    ]
  );
  const postId = postResult.rows[0]?.id;

  if (!postId) {
    throw new Error("Failed to create post.");
  }

  const assetResult = await client.query<{ id: string }>(
    `
      insert into post_assets (
        post_id,
        storage_provider,
        storage_key,
        public_url,
        asset_type,
        mime_type,
        width,
        height,
        size_bytes,
        sort_order
      )
      values ($1, $2, $3, $4, 'image', $5, $6, $7, $8, 0)
      returning id
    `,
    [
      postId,
      input.upload.storageProvider,
      input.storedAsset.storageKey,
      input.storedAsset.publicUrl,
      input.storedAsset.mimeType,
      input.storedAsset.width,
      input.storedAsset.height,
      input.storedAsset.sizeBytes
    ]
  );
  const assetId = assetResult.rows[0]?.id;

  if (!assetId) {
    throw new Error("Failed to create post asset.");
  }

  await client.query(
    `
      update posts
      set primary_asset_id = $2, updated_at = now()
      where id = $1
    `,
    [postId, assetId]
  );

  if (input.post.tags && input.post.tags.length > 0) {
    for (const tag of input.post.tags) {
      await client.query(
        `
          insert into post_tags (post_id, tag)
          values ($1, $2)
          on conflict (post_id, tag) do nothing
        `,
        [postId, tag]
      );
    }
  }

  await client.query(
    `
      update temp_image_uploads
      set status = 'consumed', uploaded_at = coalesce(uploaded_at, now()), consumed_at = now(), updated_at = now()
      where id = $1
    `,
    [input.upload.id]
  );

  return postId;
}

export const uploadsRepository = {
  async createTempImageUpload(input: {
    id: string;
    ownerUserId: string;
    storageProvider: string;
    bucketName: string;
    storageKey: string;
    originalFilename: string;
    contentType: TempImageUpload["contentType"];
    sizeBytes: number;
    checksumSha256?: string;
    expiresAt: Date;
  }): Promise<TempImageUpload> {
    const result = await query<TempImageUploadRow>(
      `
        insert into temp_image_uploads (
          id,
          owner_user_id,
          storage_provider,
          bucket_name,
          storage_key,
          original_filename,
          content_type,
          size_bytes,
          checksum_sha256,
          expires_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        returning
          id,
          owner_user_id,
          storage_provider,
          bucket_name,
          storage_key,
          original_filename,
          content_type,
          size_bytes,
          checksum_sha256,
          status,
          expires_at,
          uploaded_at,
          consumed_at
      `,
      [
        input.id,
        input.ownerUserId,
        input.storageProvider,
        input.bucketName,
        input.storageKey,
        input.originalFilename,
        input.contentType,
        input.sizeBytes,
        input.checksumSha256 ?? null,
        input.expiresAt
      ]
    );

    return mapTempImageUpload(result.rows[0]);
  },

  async findTempImageUploadById(id: string): Promise<TempImageUpload | null> {
    const result = await query<TempImageUploadRow>(
      `
        select
          id,
          owner_user_id,
          storage_provider,
          bucket_name,
          storage_key,
          original_filename,
          content_type,
          size_bytes,
          checksum_sha256,
          status,
          expires_at,
          uploaded_at,
          consumed_at
        from temp_image_uploads
        where id = $1
        limit 1
      `,
      [id]
    );

    return result.rows[0] ? mapTempImageUpload(result.rows[0]) : null;
  },

  async markTempUploadUploaded(id: string): Promise<void> {
    await query(
      `
        update temp_image_uploads
        set status = 'uploaded', uploaded_at = now(), updated_at = now()
        where id = $1
      `,
      [id]
    );
  },

  async createPostFromTempUpload(input: {
    ownerUserId: string;
    post: CreatePostInput;
    upload: TempImageUpload;
    storedAsset: StoredImageMetadata;
  }): Promise<string> {
    return transaction((client) => createPostWithAssetInTransaction(client, input));
  }
};
