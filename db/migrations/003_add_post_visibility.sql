alter table posts
  add column if not exists visibility text not null default 'public'
  check (visibility in ('public', 'private'));

create index if not exists posts_visibility_status_created_at_idx
  on posts(visibility, status, moderation_status, created_at desc);
