-- ============================================================
-- AZ Ecosistema — Endurecimiento de seguridad P0 (2026-06-28)
-- Cierra los hallazgos críticos de la auditoría:
--   1) Auto-escalada de rol/tenant en `profiles`.
--   2) `handle_new_user` confiaba en el cliente para asignar rol.
--   3) Idempotencia de pagos/liquidaciones (UNIQUE).
--   4) Canje de puntos atómico (RPC SECURITY DEFINER con bloqueo de fila).
-- ============================================================

-- ── 1. profiles: role y tenant_id inmutables en auto-actualización ──
-- La policy `profile_self_update` permite `with check (id = auth.uid())`,
-- es decir el usuario podía hacer UPDATE de su propia fila incluyendo
-- `role` y `tenant_id` → escalada a super_admin / salto de tenant.
-- Las policies RLS no pueden comparar valores OLD/NEW por columna, así que
-- lo blindamos con un trigger BEFORE UPDATE.
create or replace function public.protect_profile_privileged_cols()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- En auto-actualización (el usuario edita SU propia fila) role y tenant_id
  -- son inmutables. La asignación de esos campos la hace un admin vía
  -- service_role (auth.uid() = null) o un RPC dedicado, nunca el propio usuario.
  if auth.uid() = new.id then
    new.role := old.role;
    new.tenant_id := old.tenant_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_protect_cols on public.profiles;
create trigger on_profile_protect_cols
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_cols();

-- ── 2. handle_new_user: el cliente NUNCA elige rol ──
-- Todo registro público entra como 'ciudadano'. Los roles de staff
-- (reciclador/operador/admin_municipio/super_admin) se asignan después por
-- un admin a través de service_role, jamás desde el self-signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, tenant_id, role, full_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'tenant_id', '')::uuid,  -- municipio elegido al registrarse
    'ciudadano',                                               -- FORZADO: el cliente no elige rol
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

-- ── 3. Idempotencia de dinero (UNIQUE) ──
-- payments.bold_reference: el webhook puede reintentar el mismo evento; el
-- UNIQUE garantiza que una referencia Bold mapee a un único pago.
-- Parcial (WHERE ... not null) para permitir múltiples pagos aún sin referencia.
drop index if exists payments_bold_ref_idx;
create unique index if not exists payments_bold_ref_uk
  on payments (bold_reference) where bold_reference is not null;

-- Mismo riesgo en suscripciones SaaS de municipios.
create unique index if not exists subscriptions_bold_ref_uk
  on subscriptions (bold_reference) where bold_reference is not null;

-- payouts: una sola liquidación por reciclador y periodo → evita doble pago.
create unique index if not exists payouts_recycler_period_uk
  on payouts (recycler_id, period_start, period_end);

-- ── 4. Canje de puntos atómico ──
-- El canje desde el cliente (insert directo en redemptions) no descuenta
-- puntos ni valida saldo/stock de forma atómica → doble gasto. Este RPC lo
-- hace todo en una transacción con bloqueo de fila (FOR UPDATE).
create or replace function public.redeem_catalog_item(p_catalog_item_id uuid)
returns redemptions
language plpgsql security definer set search_path = public as $$
declare
  v_household_id uuid;
  v_tenant_id    uuid;
  v_item         catalog_items;
  v_balance      int;
  v_redemption   redemptions;
begin
  -- Identidad del que llama
  select household_id, tenant_id into v_household_id, v_tenant_id
  from profiles where id = auth.uid();

  if v_household_id is null then
    raise exception 'El usuario no tiene un hogar asociado' using errcode = 'P0001';
  end if;

  -- Bloquea el artículo y valida tenant/activo/stock
  select * into v_item from catalog_items
  where id = p_catalog_item_id and tenant_id = v_tenant_id and active
  for update;

  if not found then
    raise exception 'Artículo no disponible' using errcode = 'P0002';
  end if;

  if v_item.stock is not null and v_item.stock <= 0 then
    raise exception 'Sin stock disponible' using errcode = 'P0003';
  end if;

  -- Bloquea el hogar y valida saldo
  select points into v_balance from households
  where id = v_household_id for update;

  if v_balance < v_item.cost_points then
    raise exception 'Puntos insuficientes' using errcode = 'P0004';
  end if;

  -- Débito de puntos (el trigger apply_points_entry sincroniza households.points)
  insert into points_ledger (tenant_id, household_id, delta, reason)
  values (v_tenant_id, v_household_id, -v_item.cost_points, 'canje: ' || v_item.name);

  -- Descuenta stock si el artículo lo controla
  if v_item.stock is not null then
    update catalog_items set stock = stock - 1 where id = v_item.id;
  end if;

  -- Registra el canje
  insert into redemptions (tenant_id, household_id, catalog_item_id, cost_points, status)
  values (v_tenant_id, v_household_id, v_item.id, v_item.cost_points, 'completed')
  returning * into v_redemption;

  return v_redemption;
end;
$$;

-- Solo usuarios autenticados pueden canjear (corren como su propio auth.uid()).
revoke all on function public.redeem_catalog_item(uuid) from public;
grant execute on function public.redeem_catalog_item(uuid) to authenticated;
