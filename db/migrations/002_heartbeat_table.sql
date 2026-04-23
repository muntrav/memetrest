create table if not exists heartbeat (
  name text primary key,
  source text not null default 'unknown',
  status text not null default 'ok' check (status in ('ok', 'warning', 'error')),
  notes text not null default '',
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists heartbeat_last_seen_at_idx
  on heartbeat(last_seen_at desc);

insert into heartbeat (name, source, status, notes)
values ('project-keepalive', 'migration', 'ok', 'Initial heartbeat row')
on conflict (name) do nothing;
