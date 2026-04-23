create table if not exists temp_image_uploads (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references users(id) on delete cascade,
  storage_provider text not null,
  bucket_name text not null,
  storage_key text not null unique,
  original_filename text not null,
  content_type text not null,
  size_bytes bigint not null,
  checksum_sha256 text,
  status text not null default 'pending' check (status in ('pending', 'uploaded', 'consumed', 'expired')),
  expires_at timestamptz not null,
  uploaded_at timestamptz,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists temp_image_uploads_owner_status_idx
  on temp_image_uploads(owner_user_id, status, created_at desc);

create index if not exists temp_image_uploads_expires_at_idx
  on temp_image_uploads(expires_at);
