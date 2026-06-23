-- ============================================================
-- AZ Ecosistema — Row Level Security (RLS)
-- Aislamiento por tenant (municipio) + permisos por rol.
-- El service_role (Edge Functions / webhooks) ignora RLS.
-- ============================================================

alter table tenants        enable row level security;
alter table profiles       enable row level security;
alter table irsus          enable row level security;
alter table households     enable row level security;
alter table recyclers      enable row level security;
alter table daily_data     enable row level security;
alter table score_events   enable row level security;
alter table penalties      enable row level security;
alter table rewards        enable row level security;
alter table publications   enable row level security;
alter table reactions      enable row level security;
alter table comments       enable row level security;
alter table points_ledger  enable row level security;
alter table catalog_items  enable row level security;
alter table redemptions    enable row level security;
alter table subscriptions  enable row level security;
alter table payments       enable row level security;
alter table payouts        enable row level security;

-- ── tenants ─────────────────────────────────────────────────
create policy tenant_read on tenants for select to authenticated
  using (id = auth_tenant_id());

-- ── profiles ────────────────────────────────────────────────
create policy profile_self_read on profiles for select to authenticated
  using (id = auth.uid() or (is_staff() and tenant_id = auth_tenant_id()));
create policy profile_self_update on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ── irsus / daily_data (visibles a todo el tenant) ──────────
create policy irsus_read on irsus for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy irsus_write on irsus for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

create policy daily_read on daily_data for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy daily_write on daily_data for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

-- ── households ──────────────────────────────────────────────
create policy household_read on households for select to authenticated
  using (tenant_id = auth_tenant_id() and (is_staff() or id = my_household_id()));
create policy household_write on households for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

-- ── recyclers ───────────────────────────────────────────────
create policy recycler_read on recyclers for select to authenticated
  using (tenant_id = auth_tenant_id() and (is_staff() or user_id = auth.uid()));
create policy recycler_write on recyclers for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

-- ── score_events / penalties / rewards (propio hogar o staff) ─
create policy score_events_read on score_events for select to authenticated
  using (tenant_id = auth_tenant_id() and (is_staff() or household_id = my_household_id()));

create policy penalties_read on penalties for select to authenticated
  using (tenant_id = auth_tenant_id() and (is_staff() or household_id = my_household_id()));
create policy penalties_write on penalties for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

create policy rewards_read on rewards for select to authenticated
  using (tenant_id = auth_tenant_id() and (is_staff() or household_id = my_household_id()));
create policy rewards_write on rewards for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

-- ── publications (lee todo el tenant, escribe staff) ────────
create policy pub_read on publications for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy pub_write on publications for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

-- ── reactions (lee tenant, gestiona las propias) ────────────
create policy reaction_read on reactions for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy reaction_insert on reactions for insert to authenticated
  with check (tenant_id = auth_tenant_id() and profile_id = auth.uid());
create policy reaction_delete on reactions for delete to authenticated
  using (profile_id = auth.uid());

-- ── comments (lee tenant, crea propios, borra propio o staff) ─
create policy comment_read on comments for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy comment_insert on comments for insert to authenticated
  with check (tenant_id = auth_tenant_id() and profile_id = auth.uid());
create policy comment_delete on comments for delete to authenticated
  using (profile_id = auth.uid() or is_staff());

-- ── points_ledger (propio hogar o staff; alta solo staff) ────
create policy points_read on points_ledger for select to authenticated
  using (tenant_id = auth_tenant_id() and (is_staff() or household_id = my_household_id()));
create policy points_insert on points_ledger for insert to authenticated
  with check (is_staff() and tenant_id = auth_tenant_id());

-- ── catalog_items (lee tenant, gestiona staff) ──────────────
create policy catalog_read on catalog_items for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy catalog_write on catalog_items for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

-- ── redemptions (propio hogar o staff) ──────────────────────
create policy redemption_read on redemptions for select to authenticated
  using (tenant_id = auth_tenant_id() and (is_staff() or household_id = my_household_id()));
create policy redemption_insert on redemptions for insert to authenticated
  with check (
    tenant_id = auth_tenant_id()
    and (is_staff() or household_id = my_household_id())
  );

-- ── subscriptions / payments / payouts (solo staff lee) ─────
create policy subs_read on subscriptions for select to authenticated
  using (is_staff() and tenant_id = auth_tenant_id());
create policy subs_write on subscriptions for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());

create policy payments_read on payments for select to authenticated
  using (is_staff() and tenant_id = auth_tenant_id());

create policy payouts_read on payouts for select to authenticated
  using (
    tenant_id = auth_tenant_id()
    and (is_staff() or recycler_id = (select recycler_id from profiles where id = auth.uid()))
  );
create policy payouts_write on payouts for all to authenticated
  using (is_staff() and tenant_id = auth_tenant_id())
  with check (is_staff() and tenant_id = auth_tenant_id());
