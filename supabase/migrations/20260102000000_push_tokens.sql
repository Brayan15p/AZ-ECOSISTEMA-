-- ============================================================
-- Push tokens (Expo) — un usuario puede tener varios dispositivos.
-- ============================================================
create table push_tokens (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references profiles(id) on delete cascade,
  expo_push_token  text not null,
  created_at       timestamptz not null default now(),
  unique (user_id, expo_push_token)
);

create index push_tokens_user_idx on push_tokens(user_id);

alter table push_tokens enable row level security;

create policy "push-token-self-read" on push_tokens
  for select using (user_id = auth.uid());

create policy "push-token-self-write" on push_tokens
  for insert with check (user_id = auth.uid());

create policy "push-token-self-delete" on push_tokens
  for delete using (user_id = auth.uid());
