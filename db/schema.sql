create table if not exists newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  source text not null default 'site',
  user_agent text,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
