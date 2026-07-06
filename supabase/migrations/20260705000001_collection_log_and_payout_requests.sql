-- ============================================================
-- AZ Ecosistema — Bitácora de recolección + solicitud de liquidación (2026-07-05)
-- ------------------------------------------------------------
-- Cierra dos huecos de la app móvil que hoy solo simulan la acción en el
-- cliente sin tocar la base de datos:
--   1) "Recolectado" en la ruta del reciclador (rutas.tsx) — no existía
--      ninguna tabla de bitácora; el kg era un número fijo de demo.
--   2) "Solicitar liquidación" (liquidaciones.tsx) — la policy
--      `payouts_write` exige `is_staff()`, así que un reciclador no puede
--      insertar su propia solicitud bajo RLS.
-- Ambas se resuelven con RPCs SECURITY DEFINER (mismo patrón que
-- `redeem_catalog_item` en 20260628000001_security_p0.sql): el reciclador
-- solo puede operar sobre sus propios datos, y el pago se calcula a partir
-- de kg realmente recolectados, no de un estimado.
-- ============================================================

-- ── Bitácora de recolección ─────────────────────────────────
create table collection_log (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants (id) on delete cascade,
  recycler_id  uuid not null references recyclers (id) on delete cascade,
  household_id uuid not null references households (id) on delete cascade,
  kg           numeric(8, 2) not null check (kg > 0),
  collected_at date not null default current_date,
  created_at   timestamptz not null default now(),
  -- Una entrada por reciclador+hogar+día: reintentar/corregir actualiza el kg
  -- en vez de duplicar la parada (ver log_collection más abajo).
  unique (recycler_id, household_id, collected_at)
);
create index collection_log_tenant_idx on collection_log (tenant_id);
create index collection_log_recycler_date_idx on collection_log (recycler_id, collected_at desc);

alter table collection_log enable row level security;

-- Helper simétrico a `my_household_id()` (init.sql), usado en la policy de
-- lectura y reutilizable para futuras políticas sobre recicladores.
create or replace function public.my_recycler_id()
returns uuid language sql stable security definer set search_path = public as $$
  select recycler_id from profiles where id = auth.uid();
$$;

create policy collection_log_read on collection_log for select to authenticated
  using (
    tenant_id = auth_tenant_id()
    and (is_staff() or recycler_id = my_recycler_id())
  );

-- Sin policy de insert/update: la bitácora solo se escribe a través del RPC
-- `log_collection`, que valida que el hogar pertenece al tenant del
-- reciclador antes de registrar el kg.

-- ── RPC: registrar recolección de una parada ────────────────
create or replace function public.log_collection(p_household_id uuid, p_kg numeric)
returns collection_log
language plpgsql security definer set search_path = public as $$
declare
  v_recycler_id uuid;
  v_tenant_id   uuid;
  v_log         collection_log;
begin
  select recycler_id, tenant_id into v_recycler_id, v_tenant_id
  from profiles where id = auth.uid();

  if v_recycler_id is null then
    raise exception 'El usuario no tiene un perfil de reciclador asociado' using errcode = 'P0001';
  end if;

  if p_kg is null or p_kg <= 0 then
    raise exception 'El peso debe ser mayor a cero' using errcode = 'P0002';
  end if;

  if not exists (
    select 1 from households where id = p_household_id and tenant_id = v_tenant_id
  ) then
    raise exception 'Hogar no encontrado en tu municipio' using errcode = 'P0003';
  end if;

  insert into collection_log (tenant_id, recycler_id, household_id, kg)
  values (v_tenant_id, v_recycler_id, p_household_id, p_kg)
  -- Reintentar (o corregir un error de digitación) el mismo día actualiza el
  -- kg en vez de fallar por duplicado.
  on conflict (recycler_id, household_id, collected_at)
  do update set kg = excluded.kg
  returning * into v_log;

  return v_log;
end;
$$;

revoke all on function public.log_collection(uuid, numeric) from public;
grant execute on function public.log_collection(uuid, numeric) to authenticated;

-- ── RPC: solicitar liquidación del periodo en curso ─────────
-- El reciclador no puede insertar en `payouts` directamente (policy exige
-- is_staff()); este RPC calcula el kg real recolectado en el mes en curso
-- desde `collection_log` y crea la solicitud en su nombre. Idempotente por
-- periodo gracias al UNIQUE `payouts_recycler_period_uk` (security_p0.sql).
create or replace function public.request_payout()
returns payouts
language plpgsql security definer set search_path = public as $$
declare
  v_recycler_id  uuid;
  v_tenant_id    uuid;
  v_period_start date;
  v_period_end   date;
  v_kg           numeric;
  -- Tarifa demo; cuando exista config por municipio, leerla de ahí en vez
  -- de hardcodear (ver COP_PER_KG en packages/core/src/payouts.ts).
  v_cop_per_kg   constant int := 350;
  v_payout       payouts;
begin
  select recycler_id, tenant_id into v_recycler_id, v_tenant_id
  from profiles where id = auth.uid();

  if v_recycler_id is null then
    raise exception 'El usuario no tiene un perfil de reciclador asociado' using errcode = 'P0001';
  end if;

  v_period_start := date_trunc('month', current_date)::date;
  v_period_end   := (date_trunc('month', current_date) + interval '1 month' - interval '1 day')::date;

  if exists (
    select 1 from payouts
    where recycler_id = v_recycler_id
      and period_start = v_period_start
      and period_end = v_period_end
  ) then
    raise exception 'Ya existe una solicitud de liquidación para este periodo' using errcode = 'P0002';
  end if;

  select coalesce(sum(kg), 0) into v_kg
  from collection_log
  where recycler_id = v_recycler_id
    and collected_at between v_period_start and v_period_end;

  if v_kg <= 0 then
    raise exception 'No hay kg recolectados registrados este periodo' using errcode = 'P0003';
  end if;

  insert into payouts (tenant_id, recycler_id, period_start, period_end, kg, amount_cop, status)
  values (v_tenant_id, v_recycler_id, v_period_start, v_period_end, v_kg, round(v_kg * v_cop_per_kg), 'pending')
  returning * into v_payout;

  return v_payout;
end;
$$;

revoke all on function public.request_payout() from public;
grant execute on function public.request_payout() to authenticated;
