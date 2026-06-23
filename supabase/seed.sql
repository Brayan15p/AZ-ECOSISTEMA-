-- ============================================================
-- AZ Ecosistema — Seed (datos demo del municipio de Arauca)
-- Migrado desde INITIAL_DATA del prototipo.
-- Los puntos de cada hogar se cargan vía points_ledger (el trigger
-- apply_points_entry sincroniza households.points).
-- ============================================================

-- Tenant
insert into tenants (id, name, slug, department) values
  ('11111111-1111-1111-1111-111111111111', 'Arauca', 'arauca', 'Arauca');

-- IRSU (supervisores de zona)
insert into irsus (id, tenant_id, code, name, zone, households_count, avg_score) values
  ('22222222-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'IRSU-001', 'Sandra Morales', 'Centro + El Bosque', 420, 78.50),
  ('22222222-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'IRSU-002', 'Diego Castro', 'Meridiano + San Luis', 380, 65.00),
  ('22222222-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'IRSU-003', 'Paola Ríos', 'Unión + Norte', 350, 88.20);

-- Hogares (points en 0; se cargan por ledger más abajo)
insert into households (id, tenant_id, code, owner, address, phone, zone, score, points, irsu_id) values
  ('33333333-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'H001', 'María García',   'Cra 19 #14-22, B. Centro',     '3201234567', 'Centro',    92, 0, '22222222-0000-0000-0000-000000000001'),
  ('33333333-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'H002', 'Carlos Pérez',    'Cl 20 #8-45, B. Meridiano',    '3109876543', 'Meridiano', 78, 0, '22222222-0000-0000-0000-000000000002'),
  ('33333333-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'H003', 'Ana Rodríguez',   'Cra 22 #18-10, B. El Bosque',  '3157654321', 'El Bosque', 65, 0, '22222222-0000-0000-0000-000000000001'),
  ('33333333-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'H004', 'Jorge Martínez',  'Cl 15 #12-30, B. Unión',       '3004567890', 'Unión',     95, 0, '22222222-0000-0000-0000-000000000003'),
  ('33333333-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'H005', 'Laura Sánchez',   'Cra 25 #9-15, B. San Luis',    '3183456789', 'San Luis',  52, 0, '22222222-0000-0000-0000-000000000002');

-- Recicladores
insert into recyclers (id, tenant_id, code, name, phone, zone, households_count, kg_day, formalized, active) values
  ('44444444-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'R001', 'Pedro López',  '3201112233', 'Centro',    300, 420, true, true),
  ('44444444-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'R002', 'Martha Díaz',  '3104445566', 'Meridiano', 280, 380, true, true),
  ('44444444-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'R003', 'José Ramírez', '3157778899', 'El Bosque', 310, 440, true, true);

-- Balance de masas (última semana)
insert into daily_data (tenant_id, date, organic, recyclable, energy, reject, purity) values
  ('11111111-1111-1111-1111-111111111111', '2026-06-10', 5.8, 1.6, 1.9, 0.7, 87),
  ('11111111-1111-1111-1111-111111111111', '2026-06-11', 6.1, 1.5, 1.8, 0.6, 89),
  ('11111111-1111-1111-1111-111111111111', '2026-06-12', 5.9, 1.7, 2.0, 0.4, 91),
  ('11111111-1111-1111-1111-111111111111', '2026-06-13', 6.0, 1.4, 1.9, 0.7, 86),
  ('11111111-1111-1111-1111-111111111111', '2026-06-14', 5.7, 1.8, 2.1, 0.4, 92),
  ('11111111-1111-1111-1111-111111111111', '2026-06-15', 6.2, 1.5, 1.7, 0.6, 88),
  ('11111111-1111-1111-1111-111111111111', '2026-06-16', 5.9, 1.6, 2.0, 0.5, 90);

-- Penalizaciones
insert into penalties (tenant_id, household_id, date, type, description, severity, resolved) values
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000003', '2026-06-08', 'Contaminación cruzada', 'Orgánicos en bolsa blanca', 'leve', false),
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000005', '2026-06-05', 'No clasificación', 'Todo mezclado en una sola bolsa', 'grave', false);

-- Recompensas
insert into rewards (tenant_id, household_id, date, type, description, points) values
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000001', '2026-06-10', 'Descuento tarifa', '10% descuento servicio de aseo', 100),
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000004', '2026-06-14', 'Bono comercial', 'COP $20.000 en comercio local', 150);

-- Catálogo de canje
insert into catalog_items (tenant_id, name, description, cost_points, price_cop, stock) values
  ('11111111-1111-1111-1111-111111111111', 'Descuento 10% en tarifa de aseo', 'Aplica un 10% de descuento en tu próxima factura de aseo.', 300, 0, null),
  ('11111111-1111-1111-1111-111111111111', 'Bono COP $20.000 comercio local', 'Bono redimible en comercios aliados del municipio.', 500, 0, 50),
  ('11111111-1111-1111-1111-111111111111', 'Kit de reciclaje en casa', 'Bolsas reutilizables de colores + guía de separación.', 200, 0, 100),
  ('11111111-1111-1111-1111-111111111111', 'Compostera doméstica', 'Compostera para residuos orgánicos del hogar.', 800, 0, 20);

-- Saldo inicial de puntos (el trigger actualiza households.points)
insert into points_ledger (tenant_id, household_id, delta, reason) values
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000001', 450, 'Saldo inicial'),
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000002', 280, 'Saldo inicial'),
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000003', 180, 'Saldo inicial'),
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000004', 580, 'Saldo inicial'),
  ('11111111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000005',  90, 'Saldo inicial');

-- Publicación de bienvenida (feed)
insert into publications (tenant_id, title, body) values
  ('11111111-1111-1111-1111-111111111111',
   '¡Bienvenidos a AZ Mi Barrio! 🌱',
   'Ahora puedes ver tu puntaje de clasificación, ganar puntos y canjearlos por beneficios. Separa bien tus residuos y sube de nivel.');

-- Suscripción demo del municipio (SaaS)
insert into subscriptions (tenant_id, plan, status, current_period_end) values
  ('11111111-1111-1111-1111-111111111111', 'pro', 'trialing', now() + interval '14 days');
