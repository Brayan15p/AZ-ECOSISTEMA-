-- ============================================================
-- AZ Ecosistema — Esquema inicial (multi-tenant por municipio)
-- ============================================================

-- ── Enums ───────────────────────────────────────────────────
create type role_t as enum (
  'ciudadano', 'reciclador', 'operador', 'admin_municipio', 'super_admin'
);
create type penalty_severity as enum ('leve', 'moderada', 'grave');
create type account_type as enum ('ahorros', 'corriente');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled');
create type payment_status as enum ('pending', 'approved', 'rejected', 'refunded');
create type payout_status as enum ('pending', 'processing', 'paid', 'failed');
create type waste_stream as enum ('organic', 'recyclable', 'energy', 'reject');

-- ── Tenants (municipios) ────────────────────────────────────
create table tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  department  text not null default 'Arauca',
  created_at  timestamptz not null default now()
);

-- ── Perfiles (extiende auth.users) ──────────────────────────
create table profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  tenant_id    uuid references tenants (id) on delete set null,
  role         role_t not null default 'ciudadano',
  full_name    text,
  phone        text,
  household_id uuid,
  recycler_id  uuid,
  created_at   timestamptz not null default now()
);
create index profiles_tenant_idx on profiles (tenant_id);

-- ── IRSU (supervisores de zona) ─────────────────────────────
create table irsus (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references tenants (id) on delete cascade,
  code             text,
  name             text not null,
  zone             text not null,
  households_count int not null default 0,
  avg_score        numeric(5, 2) not null default 0,
  created_at       timestamptz not null default now()
);
create index irsus_tenant_idx on irsus (tenant_id);

-- ── Hogares ─────────────────────────────────────────────────
create table households (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants (id) on delete cascade,
  user_id    uuid references auth.users (id) on delete set null,
  code       text,
  owner      text not null,
  address    text not null,
  phone      text,
  zone       text not null,
  score      int not null default 0 check (score between 0 and 100),
  points     int not null default 0,
  irsu_id    uuid references irsus (id) on delete set null,
  created_at timestamptz not null default now()
);
create index households_tenant_idx on households (tenant_id);
create index households_user_idx on households (user_id);

-- ── Recicladores ────────────────────────────────────────────
create table recyclers (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references tenants (id) on delete cascade,
  user_id           uuid references auth.users (id) on delete set null,
  code              text,
  name              text not null,
  phone             text,
  zone              text not null,
  households_count  int not null default 0,
  kg_day            numeric(8, 2) not null default 0,
  formalized        boolean not null default false,
  active            boolean not null default true,
  bank_name         text,
  bank_account      text,
  bank_account_type account_type,
  created_at        timestamptz not null default now()
);
create index recyclers_tenant_idx on recyclers (tenant_id);

-- FK diferidas de profiles -> household/recycler
alter table profiles
  add constraint profiles_household_fk
  foreign key (household_id) references households (id) on delete set null;
alter table profiles
  add constraint profiles_recycler_fk
  foreign key (recycler_id) references recyclers (id) on delete set null;

-- ── Balance de masas diario ─────────────────────────────────
create table daily_data (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants (id) on delete cascade,
  date       date not null,
  organic    numeric(8, 2) not null default 0,
  recyclable numeric(8, 2) not null default 0,
  energy     numeric(8, 2) not null default 0,
  reject     numeric(8, 2) not null default 0,
  purity     int not null default 0 check (purity between 0 and 100),
  created_at timestamptz not null default now(),
  unique (tenant_id, date)
);
create index daily_data_tenant_date_idx on daily_data (tenant_id, date desc);

-- ── Historial de score ──────────────────────────────────────
create table score_events (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants (id) on delete cascade,
  household_id uuid not null references households (id) on delete cascade,
  old_score    int,
  new_score    int not null,
  reason       text,
  created_at   timestamptz not null default now()
);
create index score_events_household_idx on score_events (household_id);

-- ── Penalizaciones ──────────────────────────────────────────
create table penalties (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants (id) on delete cascade,
  household_id uuid not null references households (id) on delete cascade,
  date         date not null default current_date,
  type         text not null,
  description  text not null,
  severity     penalty_severity not null,
  resolved     boolean not null default false,
  created_at   timestamptz not null default now()
);
create index penalties_tenant_idx on penalties (tenant_id);

-- ── Recompensas ─────────────────────────────────────────────
create table rewards (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants (id) on delete cascade,
  household_id uuid not null references households (id) on delete cascade,
  date         date not null default current_date,
  type         text not null,
  description  text not null,
  points       int not null default 0,
  created_at   timestamptz not null default now()
);
create index rewards_tenant_idx on rewards (tenant_id);

-- ── Publicaciones / feed ────────────────────────────────────
create table publications (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants (id) on delete cascade,
  author_id  uuid references auth.users (id) on delete set null,
  title      text not null,
  body       text not null,
  media_url  text,
  created_at timestamptz not null default now()
);
create index publications_tenant_idx on publications (tenant_id, created_at desc);

create table reactions (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references tenants (id) on delete cascade,
  publication_id uuid not null references publications (id) on delete cascade,
  profile_id     uuid not null references profiles (id) on delete cascade,
  emoji          text not null,
  created_at     timestamptz not null default now(),
  unique (publication_id, profile_id, emoji)
);

create table comments (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references tenants (id) on delete cascade,
  publication_id uuid not null references publications (id) on delete cascade,
  profile_id     uuid references profiles (id) on delete set null,
  author_name    text not null,
  body           text not null,
  created_at     timestamptz not null default now()
);
create index comments_pub_idx on comments (publication_id);

-- ── Puntos y canje ──────────────────────────────────────────
create table points_ledger (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants (id) on delete cascade,
  household_id uuid not null references households (id) on delete cascade,
  delta        int not null,
  reason       text not null,
  created_at   timestamptz not null default now()
);
create index points_ledger_household_idx on points_ledger (household_id);

create table catalog_items (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants (id) on delete cascade,
  name        text not null,
  description text not null default '',
  cost_points int not null default 0,
  price_cop   int not null default 0,
  stock       int,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index catalog_tenant_idx on catalog_items (tenant_id);

create table redemptions (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenants (id) on delete cascade,
  household_id    uuid not null references households (id) on delete cascade,
  catalog_item_id uuid not null references catalog_items (id) on delete restrict,
  cost_points     int not null,
  status          text not null default 'completed',
  created_at      timestamptz not null default now()
);

-- ── Pagos (Bold) ────────────────────────────────────────────
create table subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references tenants (id) on delete cascade,
  plan               text not null default 'basico',
  status             subscription_status not null default 'trialing',
  bold_reference     text,
  current_period_end timestamptz,
  created_at         timestamptz not null default now()
);
create index subscriptions_tenant_idx on subscriptions (tenant_id);

create table payments (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references tenants (id) on delete cascade,
  profile_id     uuid references profiles (id) on delete set null,
  kind           text not null default 'other', -- subscription | redemption | other
  amount_cop     int not null,
  status         payment_status not null default 'pending',
  bold_reference text,
  raw            jsonb,
  created_at     timestamptz not null default now()
);
create index payments_tenant_idx on payments (tenant_id);
create index payments_bold_ref_idx on payments (bold_reference);

create table payouts (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants (id) on delete cascade,
  recycler_id  uuid not null references recyclers (id) on delete cascade,
  period_start date not null,
  period_end   date not null,
  kg           numeric(10, 2) not null default 0,
  amount_cop   int not null default 0,
  status       payout_status not null default 'pending',
  batch_id     uuid,
  created_at   timestamptz not null default now()
);
create index payouts_tenant_idx on payouts (tenant_id);

-- ============================================================
-- Funciones auxiliares (SECURITY DEFINER, evitan recursión RLS)
-- ============================================================
create or replace function public.auth_tenant_id()
returns uuid language sql stable security definer set search_path = public as $$
  select tenant_id from profiles where id = auth.uid();
$$;

create or replace function public.auth_role()
returns role_t language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('operador', 'admin_municipio', 'super_admin')
     from profiles where id = auth.uid()),
    false);
$$;

create or replace function public.my_household_id()
returns uuid language sql stable security definer set search_path = public as $$
  select household_id from profiles where id = auth.uid();
$$;

-- ============================================================
-- Triggers
-- ============================================================

-- Crea perfil al registrarse (tenant/rol vienen de user_metadata).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, tenant_id, role, full_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'tenant_id', '')::uuid,
    coalesce((new.raw_user_meta_data ->> 'role')::role_t, 'ciudadano'),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mantiene households.points sincronizado con el libro mayor.
create or replace function public.apply_points_entry()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update households set points = points + new.delta where id = new.household_id;
  return new;
end;
$$;

create trigger on_points_entry
  after insert on points_ledger
  for each row execute function public.apply_points_entry();

-- Registra cambios de score en score_events.
create or replace function public.log_score_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.score is distinct from old.score then
    insert into score_events (tenant_id, household_id, old_score, new_score, reason)
    values (new.tenant_id, new.id, old.score, new.score, 'actualización');
  end if;
  return new;
end;
$$;

create trigger on_household_score_change
  after update of score on households
  for each row execute function public.log_score_change();
