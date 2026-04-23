# Data Model

Last updated: 2026-04-22

## Purpose

This document defines the Postgres data model for Memetrest v1.

It translates the accepted product and architecture decisions into:

- core entities
- relationships
- integrity constraints
- privacy and ownership rules
- indexing strategy
- migration slices

The database provider for v1 is Supabase Postgres, but the schema is designed to remain provider-neutral and migration-friendly.

## Modeling Principles

- model product truth first, not UI convenience
- use app-owned tables for auth/session state
- keep privacy and moderation enforceable through data and service rules
- store binary assets outside Postgres
- represent future-compatible media and moderation fields even if v1 uses only a subset
- optimize deliberately for feed/search access patterns after integrity is defined

## Core Entity List

- `users`
- `sessions`
- `password_reset_tokens`
- `profiles`
- `posts`
- `post_assets`
- `temp_image_uploads`
- `post_tags`
- `follows`
- `follow_requests`
- `boards`
- `board_items`
- `featured_content`
- `moderation_actions`
- `seed_import_jobs`
- `seed_import_items`
- `heartbeat`

## Identity And Profile Domain

## Table: `users`

System identity record.

Columns:

- `id` UUID PK
- `email` CITEXT unique not null
- `password_hash` TEXT not null
- `role` TEXT not null default `user`
- `status` TEXT not null default `active`
- `email_verified_at` TIMESTAMPTZ nullable
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

Allowed values:

- `role`: `user`, `admin`
- `status`: `active`, `banned`

Rules:

- email uniqueness is case-insensitive
- banned users cannot create sessions or content

Indexes:

- unique index on `email`
- index on `role`
- index on `status`

## Table: `sessions`

App-owned authenticated sessions.

Columns:

- `id` UUID PK
- `user_id` UUID not null FK -> `users.id`
- `session_token_hash` TEXT unique not null
- `ip_address` INET nullable
- `user_agent` TEXT nullable
- `expires_at` TIMESTAMPTZ not null
- `revoked_at` TIMESTAMPTZ nullable
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

Rules:

- store hashed token, not raw token
- only one row per issued session token
- revoked session is invalid regardless of expiry

Indexes:

- unique index on `session_token_hash`
- index on `user_id`
- index on `expires_at`

## Table: `password_reset_tokens`

App-owned password reset flow support.

Columns:

- `id` UUID PK
- `user_id` UUID not null FK -> `users.id`
- `token_hash` TEXT unique not null
- `expires_at` TIMESTAMPTZ not null
- `used_at` TIMESTAMPTZ nullable
- `created_at` TIMESTAMPTZ not null default now()

Rules:

- token must be single-use
- expired or used tokens are invalid

Indexes:

- unique index on `token_hash`
- index on `user_id`
- index on `expires_at`

## Table: `profiles`

Public identity and privacy layer over the user account.

Columns:

- `id` UUID PK
- `user_id` UUID unique not null FK -> `users.id`
- `username` CITEXT unique not null
- `display_name` TEXT not null
- `bio` TEXT not null default `''`
- `avatar_asset_id` UUID nullable FK -> `post_assets.id`
- `avatar_url` TEXT nullable
- `visibility` TEXT not null default `public`
- `follow_approval_required` BOOLEAN not null default false
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

Allowed values:

- `visibility`: `public`, `private`

Rules:

- `follow_approval_required` should be true when `visibility = private`
- username is unique, case-insensitive, and editable
- every user must have exactly one profile

Indexes:

- unique index on `user_id`
- unique index on `username`
- index on `visibility`

## Follow Domain

## Table: `follows`

Accepted follow relationships.

Columns:

- `id` UUID PK
- `follower_profile_id` UUID not null FK -> `profiles.id`
- `followed_profile_id` UUID not null FK -> `profiles.id`
- `created_at` TIMESTAMPTZ not null default now()

Rules:

- unique pair per follower/followed profile
- follower cannot equal followed profile
- row exists only for accepted follows

Indexes:

- unique composite index on (`follower_profile_id`, `followed_profile_id`)
- index on `followed_profile_id`
- index on `follower_profile_id`

## Table: `follow_requests`

Pending or resolved requests for private profiles.

Columns:

- `id` UUID PK
- `requester_profile_id` UUID not null FK -> `profiles.id`
- `target_profile_id` UUID not null FK -> `profiles.id`
- `status` TEXT not null default `pending`
- `requested_at` TIMESTAMPTZ not null default now()
- `responded_at` TIMESTAMPTZ nullable

Allowed values:

- `status`: `pending`, `approved`, `rejected`, `cancelled`

Rules:

- unique active request per requester/target pair
- requester cannot equal target
- approved request should result in a corresponding `follows` row

Indexes:

- index on `target_profile_id`
- index on `requester_profile_id`
- index on `status`
- composite index on (`target_profile_id`, `status`)

Implementation note:

- backend services should keep `follow_requests` and `follows` consistent

## Content Domain

## Table: `posts`

User-created meme/content record.

Columns:

- `id` UUID PK
- `author_profile_id` UUID not null FK -> `profiles.id`
- `caption` TEXT not null default `''`
- `visibility` TEXT not null default `public`
- `status` TEXT not null default `published`
- `moderation_status` TEXT not null default `visible`
- `featured_rank` INTEGER nullable
- `primary_asset_id` UUID nullable
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

Allowed values:

Allowed values:

- `visibility`: `public`, `private`
- `status`: `draft`, `published`, `archived`
- `moderation_status`: `visible`, `removed`

Rules:

- private posts are visible only to the author in v1
- v1 posts are visible only when `status = published` and `moderation_status = visible`
- post access must also respect the author profile visibility

Indexes:

- index on `author_profile_id`
- index on `created_at desc`
- composite index on (`status`, `moderation_status`, `created_at desc`)
- index on `featured_rank`

Implementation note:

- `primary_asset_id` should reference the lead asset after `post_assets` row exists

## Table: `post_assets`

Metadata for uploaded media stored outside Postgres.

Columns:

- `id` UUID PK
- `post_id` UUID not null FK -> `posts.id`
- `storage_provider` TEXT not null
- `storage_key` TEXT not null
- `public_url` TEXT not null
- `asset_type` TEXT not null
- `mime_type` TEXT not null
- `width` INTEGER nullable
- `height` INTEGER nullable
- `duration_ms` INTEGER nullable
- `size_bytes` BIGINT not null
- `sort_order` INTEGER not null default 0
- `created_at` TIMESTAMPTZ not null default now()

Allowed values:

- `asset_type`: `image`, `gif`, `video`

Rules:

- v1 uses only `image`
- keep forward compatibility for GIF/video
- one asset key should be unique per provider

Indexes:

- index on `post_id`
- unique composite index on (`storage_provider`, `storage_key`)
- composite index on (`post_id`, `sort_order`)

## Table: `temp_image_uploads`

Short-lived upload intent records for image publishing.

Columns:

- `id` UUID PK
- `owner_user_id` UUID not null FK -> `users.id`
- `storage_provider` TEXT not null
- `bucket_name` TEXT not null
- `storage_key` TEXT not null unique
- `original_filename` TEXT not null
- `content_type` TEXT not null
- `size_bytes` BIGINT not null
- `checksum_sha256` TEXT nullable
- `status` TEXT not null default `pending`
- `expires_at` TIMESTAMPTZ not null
- `uploaded_at` TIMESTAMPTZ nullable
- `consumed_at` TIMESTAMPTZ nullable
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

Allowed values:

- `status`: `pending`, `uploaded`, `consumed`, `expired`

Rules:

- upload intents are owned by a single user and can only be consumed once
- temp uploads expire independently of session state
- object metadata lives here until a real `post_assets` row is created
- v1 uses these rows only for image publishing, but the pattern should remain provider-portable

Indexes:

- unique index on `storage_key`
- composite index on (`owner_user_id`, `status`, `created_at desc`)
- index on `expires_at`

## Table: `post_tags`

Normalized tag mapping.

Columns:

- `id` UUID PK
- `post_id` UUID not null FK -> `posts.id`
- `tag` CITEXT not null
- `created_at` TIMESTAMPTZ not null default now()

Rules:

- unique tag per post

Indexes:

- unique composite index on (`post_id`, `tag`)
- index on `tag`

## Boards Domain

## Table: `boards`

User-owned board/collection container.

Columns:

- `id` UUID PK
- `owner_profile_id` UUID not null FK -> `profiles.id`
- `slug` CITEXT unique nullable
- `title` TEXT not null
- `description` TEXT not null default `''`
- `visibility` TEXT not null default `public`
- `sort_order` INTEGER not null default 0
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

Allowed values:

- `visibility`: `public`, `private`

Rules:

- board title length constraints enforced in app and DB-safe limits
- slug required for boards intended to be shared publicly, but may initially be nullable while generated
- `sort_order` controls owner-specific board ordering

Indexes:

- index on `owner_profile_id`
- unique index on `slug`
- composite index on (`owner_profile_id`, `sort_order`)
- composite index on (`owner_profile_id`, `visibility`)

## Table: `board_items`

Mapping between a board and saved posts.

Columns:

- `id` UUID PK
- `board_id` UUID not null FK -> `boards.id`
- `post_id` UUID not null FK -> `posts.id`
- `sort_order` INTEGER not null default 0
- `saved_at` TIMESTAMPTZ not null default now()

Rules:

- same post can only appear once in a board
- reorder within board uses `sort_order`

Indexes:

- unique composite index on (`board_id`, `post_id`)
- composite index on (`board_id`, `sort_order`)
- index on `post_id`

## Curation And Moderation Domain

## Table: `featured_content`

Admin-curated content input to feeds/discovery.

Columns:

- `id` UUID PK
- `post_id` UUID not null FK -> `posts.id`
- `placement` TEXT not null
- `rank` INTEGER not null default 0
- `starts_at` TIMESTAMPTZ nullable
- `ends_at` TIMESTAMPTZ nullable
- `created_by_user_id` UUID not null FK -> `users.id`
- `created_at` TIMESTAMPTZ not null default now()

Allowed values:

- `placement`: `for_you`, `trending`, `discovery`, `search_boost`

Rules:

- same post may appear in multiple placements
- only active date windows should influence user-facing queries

Indexes:

- index on `post_id`
- composite index on (`placement`, `rank`)
- composite index on (`placement`, `starts_at`, `ends_at`)

## Table: `moderation_actions`

Audit log of moderation/admin actions.

Columns:

- `id` UUID PK
- `admin_user_id` UUID not null FK -> `users.id`
- `target_type` TEXT not null
- `target_id` UUID not null
- `action_type` TEXT not null
- `reason` TEXT nullable
- `metadata_json` JSONB not null default '{}'::jsonb
- `created_at` TIMESTAMPTZ not null default now()

Allowed values:

- `target_type`: `user`, `profile`, `post`, `board`, `seed_import_job`
- `action_type`: `ban_user`, `unban_user`, `remove_post`, `restore_post`, `feature_post`, `unfeature_post`, `seed_import`, `seed_delete`

Rules:

- this is append-only
- state changes on target entities should reference a moderation action where applicable

Indexes:

- index on `admin_user_id`
- composite index on (`target_type`, `target_id`)
- index on `action_type`
- index on `created_at desc`

## Seed Content Domain

## Table: `seed_import_jobs`

Tracks admin/operator seed import operations.

Columns:

- `id` UUID PK
- `created_by_user_id` UUID not null FK -> `users.id`
- `source_type` TEXT not null
- `status` TEXT not null default `pending`
- `notes` TEXT not null default `''`
- `started_at` TIMESTAMPTZ nullable
- `completed_at` TIMESTAMPTZ nullable
- `created_at` TIMESTAMPTZ not null default now()

Allowed values:

- `source_type`: `manual_upload`, `script_import`
- `status`: `pending`, `running`, `completed`, `failed`

Indexes:

- index on `created_by_user_id`
- index on `status`
- index on `created_at desc`

## Table: `seed_import_items`

Tracks which imported records belong to which seed job.

Columns:

- `id` UUID PK
- `seed_import_job_id` UUID not null FK -> `seed_import_jobs.id`
- `post_id` UUID nullable FK -> `posts.id`
- `status` TEXT not null default `created`
- `source_reference` TEXT nullable
- `error_message` TEXT nullable
- `created_at` TIMESTAMPTZ not null default now()

Allowed values:

- `status`: `created`, `skipped`, `failed`

Indexes:

- index on `seed_import_job_id`
- index on `post_id`
- index on `status`

## Operational Support

## Table: `heartbeat`

Operational keepalive and scheduler liveness marker.

Columns:

- `name` TEXT PK
- `source` TEXT not null default `unknown`
- `status` TEXT not null default `ok`
- `notes` TEXT not null default `''`
- `last_seen_at` TIMESTAMPTZ not null default now()
- `created_at` TIMESTAMPTZ not null default now()
- `updated_at` TIMESTAMPTZ not null default now()

Allowed values:

- `status`: `ok`, `warning`, `error`

Rules:

- not part of user-facing product data
- used by external keepalive automation and operational diagnostics
- should never be queried by product features

Indexes:

- index on `last_seen_at desc`

## Ownership Rules

- `users` own `sessions` and `password_reset_tokens`
- `users` own exactly one `profile`
- `profiles` own `posts`
- `profiles` own `boards`
- `boards` own `board_items`
- `posts` own `post_assets` and `post_tags`
- `users` own `temp_image_uploads`
- `users` with admin role own `featured_content` creation and `moderation_actions`

## Privacy And Access Rules

### Profiles

- `profiles.visibility = public`
  - anyone can view published, visible posts
- `profiles.visibility = private`
  - only the owner and accepted followers can view profile and posts

### Boards

- `boards.visibility = public`
  - anyone can view board and board items
- `boards.visibility = private`
  - only owner can view

### Posts

Posts do not carry a separate public/private flag in v1.

Post accessibility is derived from:

- author profile visibility
- follow/follow request state
- post publication status
- moderation visibility state

## Search And Feed Access Patterns

The schema must support:

- latest posts across accessible public/private boundaries
- following feed by followed profiles
- curated/featured/trending retrieval
- search by caption
- search by creator identity
- search by tags

## Recommended Index Strategy

### Feed-Critical

- `posts(status, moderation_status, created_at desc)`
- `posts(author_profile_id, created_at desc)`
- `follows(follower_profile_id, followed_profile_id)`
- `featured_content(placement, rank)`

### Privacy-Critical

- `profiles(visibility)`
- `follow_requests(target_profile_id, status)`

### Board-Critical

- `boards(owner_profile_id, sort_order)`
- `board_items(board_id, sort_order)`
- `board_items(board_id, post_id)`

### Search-Critical

- `profiles(username)`
- `post_tags(tag)`
- text search indexes should be added in implementation for:
  - `posts.caption`
  - searchable profile fields such as `username` and `display_name`

## Integrity Constraints

- usernames and emails must be unique case-insensitively
- no self-follows
- no self-follow-requests
- no duplicate board item for the same post in the same board
- no duplicate accepted follow pair
- moderation actions are append-only
- session and reset tokens must be hashed before persistence

## Soft Delete vs Hard Delete

Recommended v1 behavior:

- `posts`: soft remove via `moderation_status`
- `users`: ban via `status`, avoid destructive delete in normal moderation
- `boards`: app-level delete may hard-delete board and board_items if user requests deletion
- `sessions`: revoke or expire rather than mutate auth history unsafely

## Migration Plan

The current app has only a file-backed collections slice.

Migration should happen in vertical slices rather than one giant rewrite.

### Migration Slice 1: Platform Tables

- `users`
- `sessions`
- `password_reset_tokens`
- `profiles`

Outcome:

- auth and identity foundation exists

### Migration Slice 2: Content Tables

- `posts`
- `post_assets`
- `post_tags`

Outcome:

- real creator upload and seeded content can be implemented

### Migration Slice 3: Follow And Privacy Tables

- `follows`
- `follow_requests`

Outcome:

- private profile access control becomes real

### Migration Slice 4: Board Tables

- `boards`
- `board_items`

Outcome:

- replace file-backed collections with database-backed boards and saved items

### Migration Slice 5: Admin And Curation Tables

- `featured_content`
- `moderation_actions`
- `seed_import_jobs`
- `seed_import_items`

Outcome:

- admin/moderation and seed workflows become persistent and auditable

## Existing Collections Slice Migration Notes

The current file-backed collections slice stores:

- `id`
- `title`
- `itemCount`
- `previewImages`
- `visibility`
- `tags`
- `updatedAt`

Migration plan:

- move boards into `boards`
- move saved relationships into `board_items`
- treat `itemCount` as derived from `board_items`
- move preview image behavior to query-time derivation from the newest saved posts in a board
- preserve current public/private board semantics

## Deferred Decisions

- whether `slug` generation is automatic or user-editable for boards
- whether featured content should be collapsed into moderation or stay separate
- whether denormalized counters are introduced in v1 or deferred until needed
- exact full-text search implementation details

## Recommended Next Phase

Hand off to:

- `sdlc-api-contracts`
- `sdlc-backend-implementation`

The schema boundaries are now stable enough to define read/write contracts and begin implementation.
