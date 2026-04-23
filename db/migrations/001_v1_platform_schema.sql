create extension if not exists citext;
create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  password_hash text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'active' check (status in ('active', 'banned')),
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  session_token_hash text not null unique,
  ip_address inet,
  user_agent text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  username citext not null unique,
  display_name text not null,
  bio text not null default '',
  avatar_asset_id uuid,
  avatar_url text,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  follow_approval_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_private_requires_approval
    check (visibility = 'public' or follow_approval_required = true)
);

create table if not exists follows (
  id uuid primary key default gen_random_uuid(),
  follower_profile_id uuid not null references profiles(id) on delete cascade,
  followed_profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint follows_no_self_follow check (follower_profile_id <> followed_profile_id),
  constraint follows_unique_pair unique (follower_profile_id, followed_profile_id)
);

create table if not exists follow_requests (
  id uuid primary key default gen_random_uuid(),
  requester_profile_id uuid not null references profiles(id) on delete cascade,
  target_profile_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'canceled')),
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint follow_requests_no_self_request check (requester_profile_id <> target_profile_id)
);

create unique index if not exists follow_requests_unique_pending
  on follow_requests(requester_profile_id, target_profile_id)
  where status = 'pending';

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_profile_id uuid not null references profiles(id) on delete cascade,
  caption text not null default '',
  overlay_text_top text,
  overlay_text_bottom text,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  moderation_status text not null default 'visible' check (moderation_status in ('visible', 'removed')),
  featured_rank integer,
  primary_asset_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists post_assets (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  storage_provider text not null,
  storage_key text not null,
  public_url text not null,
  asset_type text not null check (asset_type in ('image', 'gif', 'video')),
  mime_type text not null,
  width integer,
  height integer,
  duration_ms integer,
  size_bytes bigint not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint post_assets_unique_storage_key unique (storage_provider, storage_key)
);

alter table posts
  drop constraint if exists posts_primary_asset_id_fkey;

alter table posts
  add constraint posts_primary_asset_id_fkey
  foreign key (primary_asset_id) references post_assets(id) on delete set null;

alter table profiles
  drop constraint if exists profiles_avatar_asset_id_fkey;

alter table profiles
  add constraint profiles_avatar_asset_id_fkey
  foreign key (avatar_asset_id) references post_assets(id) on delete set null;

create table if not exists post_tags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  tag citext not null,
  created_at timestamptz not null default now(),
  constraint post_tags_unique_post_tag unique (post_id, tag)
);

create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references profiles(id) on delete cascade,
  slug citext unique,
  title text not null,
  description text not null default '',
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists board_items (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  sort_order integer not null default 0,
  saved_at timestamptz not null default now(),
  constraint board_items_unique_board_post unique (board_id, post_id)
);

create table if not exists featured_content (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  placement text not null check (placement in ('for_you', 'trending', 'discovery', 'search_boost')),
  rank integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by_user_id uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists moderation_actions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references users(id),
  target_type text not null check (target_type in ('user', 'profile', 'post', 'board', 'seed_import_job')),
  target_id uuid not null,
  action_type text not null check (
    action_type in (
      'ban_user',
      'unban_user',
      'remove_post',
      'restore_post',
      'feature_post',
      'unfeature_post',
      'seed_import',
      'seed_delete'
    )
  ),
  reason text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists seed_import_jobs (
  id uuid primary key default gen_random_uuid(),
  created_by_user_id uuid not null references users(id),
  source_type text not null check (source_type in ('manual_upload', 'script_import')),
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  notes text not null default '',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists seed_import_items (
  id uuid primary key default gen_random_uuid(),
  seed_import_job_id uuid not null references seed_import_jobs(id) on delete cascade,
  post_id uuid references posts(id) on delete set null,
  status text not null default 'created' check (status in ('created', 'skipped', 'failed')),
  source_reference text,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists users_role_idx on users(role);
create index if not exists users_status_idx on users(status);
create index if not exists sessions_user_id_idx on sessions(user_id);
create index if not exists sessions_expires_at_idx on sessions(expires_at);
create index if not exists password_reset_tokens_user_id_idx on password_reset_tokens(user_id);
create index if not exists password_reset_tokens_expires_at_idx on password_reset_tokens(expires_at);
create index if not exists profiles_visibility_idx on profiles(visibility);
create index if not exists follows_followed_profile_id_idx on follows(followed_profile_id);
create index if not exists follows_follower_profile_id_idx on follows(follower_profile_id);
create index if not exists follow_requests_target_status_idx on follow_requests(target_profile_id, status);
create index if not exists posts_author_created_at_idx on posts(author_profile_id, created_at desc);
create index if not exists posts_public_feed_idx on posts(status, moderation_status, created_at desc);
create index if not exists posts_caption_search_idx on posts using gin(to_tsvector('simple', caption));
create index if not exists post_assets_post_id_sort_order_idx on post_assets(post_id, sort_order);
create index if not exists post_tags_tag_idx on post_tags(tag);
create index if not exists boards_owner_sort_order_idx on boards(owner_profile_id, sort_order);
create index if not exists boards_owner_visibility_idx on boards(owner_profile_id, visibility);
create index if not exists board_items_board_sort_order_idx on board_items(board_id, sort_order);
create index if not exists board_items_post_id_idx on board_items(post_id);
create index if not exists featured_content_placement_rank_idx on featured_content(placement, rank);
create index if not exists featured_content_active_window_idx on featured_content(placement, starts_at, ends_at);
create index if not exists moderation_actions_target_idx on moderation_actions(target_type, target_id);
create index if not exists moderation_actions_created_at_idx on moderation_actions(created_at desc);
create index if not exists seed_import_jobs_status_idx on seed_import_jobs(status);
create index if not exists seed_import_jobs_created_at_idx on seed_import_jobs(created_at desc);
create index if not exists seed_import_items_job_idx on seed_import_items(seed_import_job_id);
