-- ============================================================
-- AZ Ecosistema · Esquema inicial con seguridad por filas (RLS)
-- ============================================================
-- Reglas de oro:
--  1. RLS habilitado en TODAS las tablas con datos sensibles.
--  2. Usuarios anónimos NO pueden leer ni escribir nada.
--  3. Cada usuario solo ve lo suyo (hogar, recompensas, comentarios).
--  4. Operadores (rol "operador") tienen lectura amplia + escritura
--     en su zona/dominio.
--  5. Auditoría: triggers que registran cambios sensibles en
--     `audit_log` (write-only para usuarios; lectura solo admin).
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ── Tipos ───────────────────────────────────────────────────────
create type app_role as enum ('admin', 'operador', 'irsu', 'ciudadano');
create type publication_category as enum ('anuncio', 'campaña', 'educativo', 'alerta');
create type penalty_severity as enum ('Leve', 'Moderada', 'Grave');
create type residential_zone as enum ('Centro', 'Meridiano', 'El Bosque', 'Unión', 'San Luis', 'Norte');

-- ── Tabla: profiles (vinculada 1:1 con auth.users) ──────────────
-- No exponemos auth.users directamente al cliente. El rol vive aquí
-- y se valida en políticas RLS.
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        app_role not null default 'ciudadano',
  full_name   text not null,
  phone       text,
  zone        residential_zone,
  household_id uuid,                          -- enlace al hogar del ciudadano
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index profiles_role_idx on profiles(role);
create index profiles_zone_idx on profiles(zone);

-- ── Tabla: households ───────────────────────────────────────────
create table households (
  id              uuid primary key default uuid_generate_v4(),
  code            text unique not null,        -- ej. "H001"
  owner_name      text not null,
  address         text not null,
  phone           text,
  zone            residential_zone not null,
  score           integer not null default 0 check (score between 0 and 100),
  points          integer not null default 0 check (points >= 0),
  penalties_count integer not null default 0,
  rewards_count   integer not null default 0,
  last_audit_at   timestamptz,
  irsu_id         uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index households_zone_idx on households(zone);
create index households_irsu_idx on households(irsu_id);

alter table profiles
  add constraint profiles_household_fk foreign key (household_id) references households(id) on delete set null;

-- ── Tabla: audits ───────────────────────────────────────────────
create table audits (
  id           uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  irsu_id      uuid not null references profiles(id) on delete restrict,
  score        integer not null check (score between 0 and 100),
  notes        text,
  occurred_at  timestamptz not null default now()
);

create index audits_household_idx on audits(household_id, occurred_at desc);

-- ── Tabla: penalties / rewards ──────────────────────────────────
create table penalties (
  id           uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  type         text not null,
  description  text,
  severity     penalty_severity not null,
  resolved     boolean not null default false,
  created_by   uuid not null references profiles(id) on delete restrict,
  created_at   timestamptz not null default now()
);

create table rewards (
  id           uuid primary key default uuid_generate_v4(),
  household_id uuid not null references households(id) on delete cascade,
  type         text not null,
  description  text,
  points       integer not null,
  created_by   uuid not null references profiles(id) on delete restrict,
  created_at   timestamptz not null default now()
);

-- ── Tabla: publications + reacciones / comentarios ──────────────
create table publications (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  body         text not null,
  category     publication_category not null default 'anuncio',
  author_id    uuid not null references profiles(id) on delete restrict,
  image_url    text,
  video_url    text,
  zone         residential_zone,             -- null = todas las zonas
  published_at timestamptz not null default now()
);

create index publications_published_idx on publications(published_at desc);
create index publications_zone_idx on publications(zone);

create table publication_reactions (
  publication_id uuid not null references publications(id) on delete cascade,
  user_id        uuid not null references profiles(id) on delete cascade,
  emoji          text not null check (length(emoji) between 1 and 4),
  created_at     timestamptz not null default now(),
  primary key (publication_id, user_id, emoji)
);

create table publication_comments (
  id             uuid primary key default uuid_generate_v4(),
  publication_id uuid not null references publications(id) on delete cascade,
  user_id        uuid not null references profiles(id) on delete cascade,
  body           text not null check (length(body) between 1 and 1000),
  created_at     timestamptz not null default now()
);

create index publication_comments_pub_idx on publication_comments(publication_id, created_at desc);

-- ── Tabla: audit_log (trazabilidad inmutable) ───────────────────
create table audit_log (
  id          bigserial primary key,
  actor_id    uuid references profiles(id) on delete set null,
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  before      jsonb,
  after       jsonb,
  occurred_at timestamptz not null default now()
);

create index audit_log_entity_idx on audit_log(entity, entity_id);
create index audit_log_actor_idx on audit_log(actor_id, occurred_at desc);

-- ============================================================
-- Helpers seguros (SECURITY DEFINER para evitar bypass por RLS
-- dentro de la propia política, ver Supabase docs).
-- ============================================================
create or replace function public.current_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function public.current_household_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select household_id from profiles where id = auth.uid();
$$;

-- ============================================================
-- RLS — Habilitar y declarar políticas explícitas
-- ============================================================
alter table profiles                enable row level security;
alter table households              enable row level security;
alter table audits                  enable row level security;
alter table penalties               enable row level security;
alter table rewards                 enable row level security;
alter table publications            enable row level security;
alter table publication_reactions   enable row level security;
alter table publication_comments    enable row level security;
alter table audit_log               enable row level security;

-- profiles: cada uno ve y edita su propio perfil; operadores/admin leen todos.
create policy "profile-self-read" on profiles
  for select using (id = auth.uid() or public.current_role() in ('operador','admin','irsu'));

create policy "profile-self-update" on profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

create policy "profile-admin-write" on profiles
  for all using (public.current_role() in ('admin'))
  with check (public.current_role() = 'admin');

-- households: ciudadano ve solo su hogar; operador/irsu ven todos; escritura solo operador/admin.
create policy "household-citizen-read" on households
  for select using (id = public.current_household_id() or public.current_role() in ('operador','admin','irsu'));

create policy "household-operator-write" on households
  for all using (public.current_role() in ('operador','admin'))
  with check (public.current_role() in ('operador','admin'));

-- audits: ciudadano ve los de su hogar; irsu/operador ven todos.
create policy "audit-read" on audits
  for select using (
    household_id = public.current_household_id()
    or public.current_role() in ('operador','admin','irsu')
  );

create policy "audit-irsu-insert" on audits
  for insert with check (public.current_role() in ('irsu','operador','admin') and irsu_id = auth.uid());

-- penalties / rewards: misma lógica de lectura; escritura solo operador/admin/irsu.
create policy "penalty-read" on penalties
  for select using (
    household_id = public.current_household_id()
    or public.current_role() in ('operador','admin','irsu')
  );

create policy "penalty-write" on penalties
  for all using (public.current_role() in ('operador','admin','irsu'))
  with check (public.current_role() in ('operador','admin','irsu'));

create policy "reward-read" on rewards
  for select using (
    household_id = public.current_household_id()
    or public.current_role() in ('operador','admin','irsu')
  );

create policy "reward-write" on rewards
  for all using (public.current_role() in ('operador','admin','irsu'))
  with check (public.current_role() in ('operador','admin','irsu'));

-- publications: cualquier autenticado de la zona puede leer; escritura solo operador/admin.
create policy "publication-read" on publications
  for select using (
    auth.role() = 'authenticated' and (
      zone is null
      or zone = (select zone from profiles where id = auth.uid())
      or public.current_role() in ('operador','admin','irsu')
    )
  );

create policy "publication-write" on publications
  for all using (public.current_role() in ('operador','admin'))
  with check (public.current_role() in ('operador','admin') and author_id = auth.uid());

-- reacciones / comentarios: cada usuario maneja los suyos; todos los autenticados ven los demás.
create policy "reaction-read" on publication_reactions
  for select using (auth.role() = 'authenticated');

create policy "reaction-self-write" on publication_reactions
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "comment-read" on publication_comments
  for select using (auth.role() = 'authenticated');

create policy "comment-self-write" on publication_comments
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- audit_log: nadie escribe directo (lo hacen triggers SECURITY DEFINER);
-- solo admin puede leer.
create policy "audit-log-admin-read" on audit_log
  for select using (public.current_role() = 'admin');

-- ============================================================
-- Trigger: registrar cambios sensibles en audit_log
-- ============================================================
create or replace function public.log_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into audit_log(actor_id, action, entity, entity_id, before, after)
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

create trigger log_households after insert or update or delete on households
  for each row execute function public.log_audit();

create trigger log_audits after insert or update or delete on audits
  for each row execute function public.log_audit();

create trigger log_penalties after insert or update or delete on penalties
  for each row execute function public.log_audit();

create trigger log_rewards after insert or update or delete on rewards
  for each row execute function public.log_audit();
