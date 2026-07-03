create table if not exists newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  source text not null default 'site',
  user_agent text,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists page_events (
  id bigserial primary key,
  event_type text not null default 'page_view',
  path text not null,
  title text,
  referrer text,
  session_id text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_events_created_at_idx on page_events (created_at desc);
create index if not exists page_events_path_idx on page_events (path);
