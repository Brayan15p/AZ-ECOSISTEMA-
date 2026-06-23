/**
 * Datos de demostración tipados con el modelo de dominio de @az/core.
 * Sirven para mover las pantallas mientras conectamos Supabase de verdad.
 * Cuando exista la BD + .env, se reemplazan por queries reales.
 */
import type {
  CatalogItem,
  Household,
  Payout,
  Penalty,
  PointsEntry,
  Recycler,
  Reward,
  RouteStop,
} from "@az/core";

const TENANT = "arauca"; // municipio (tenant) demo

export const mockHousehold: Household = {
  id: "hh-001",
  tenantId: TENANT,
  userId: "user-001",
  owner: "Familia Pedraza",
  address: "Cra 21 # 18-40, Barrio Córdoba",
  phone: "+57 3000000000",
  zone: "Zona 3 · Córdoba",
  score: 88,
  points: 1450,
  irsuId: "irsu-01",
  createdAt: "2026-01-15",
};

export const mockPointsLedger: PointsEntry[] = [
  { id: "p1", tenantId: TENANT, householdId: "hh-001", delta: 100, reason: "Bono de cierre de periodo", createdAt: "2026-06-01" },
  { id: "p2", tenantId: TENANT, householdId: "hh-001", delta: 60, reason: "Separación correcta (semana)", createdAt: "2026-06-08" },
  { id: "p3", tenantId: TENANT, householdId: "hh-001", delta: -50, reason: "Canje: Bono mercado", createdAt: "2026-06-12" },
  { id: "p4", tenantId: TENANT, householdId: "hh-001", delta: 40, reason: "Reporte de punto crítico", createdAt: "2026-06-16" },
];

export const mockRewards: Reward[] = [
  { id: "r1", tenantId: TENANT, householdId: "hh-001", date: "2026-06-16", type: "reporte", description: "Reportaste un punto crítico de basuras", points: 40 },
  { id: "r2", tenantId: TENANT, householdId: "hh-001", date: "2026-06-08", type: "separacion", description: "Semana con separación correcta", points: 60 },
];

export const mockPenalties: Penalty[] = [
  { id: "pen1", tenantId: TENANT, householdId: "hh-001", date: "2026-05-28", type: "horario", description: "Residuos sacados fuera de horario", severity: "leve", resolved: true },
];

export const mockCatalog: CatalogItem[] = [
  { id: "c1", tenantId: TENANT, name: "Bono mercado $20.000", description: "Canjeable en tiendas aliadas del municipio", costPoints: 500, priceCop: 0, stock: 50, active: true },
  { id: "c2", tenantId: TENANT, name: "Descuento factura de aseo", description: "10% de descuento en el próximo recibo", costPoints: 800, priceCop: 0, stock: null, active: true },
  { id: "c3", tenantId: TENANT, name: "Kit de reciclaje hogar", description: "3 canecas + bolsas reutilizables", costPoints: 1200, priceCop: 0, stock: 0, active: true },
  { id: "c4", tenantId: TENANT, name: "Árbol nativo (siembra)", description: "Siembra a tu nombre en zona verde", costPoints: 300, priceCop: 0, stock: 20, active: false },
];

export const mockRecycler: Recycler = {
  id: "rec-001",
  tenantId: TENANT,
  userId: "user-002",
  name: "Carlos Mendoza",
  phone: "+57 3010000000",
  zone: "Zona 3 · Córdoba",
  householdsCount: 142,
  kgDay: 320,
  formalized: true,
  active: true,
  bankName: "Bancolombia",
  bankAccount: "•••• 4821",
  bankAccountType: "ahorros",
};

export const mockRoute: RouteStop[] = [
  { id: "hh-001", owner: "Familia Pedraza", address: "Cra 21 # 18-40", zone: "Zona 3 · Córdoba", score: 88, status: "collected", kg: 12 },
  { id: "hh-014", owner: "Familia Rojas", address: "Cra 22 # 18-12", zone: "Zona 3 · Córdoba", score: 72, status: "collected", kg: 9 },
  { id: "hh-027", owner: "Tienda La Esquina", address: "Cll 19 # 21-05", zone: "Zona 3 · Córdoba", score: 64, status: "pending", kg: null },
  { id: "hh-031", owner: "Familia Gómez", address: "Cll 18 # 20-77", zone: "Zona 3 · Córdoba", score: 91, status: "pending", kg: null },
  { id: "hh-045", owner: "Familia Niño", address: "Cra 23 # 17-30", zone: "Zona 3 · Córdoba", score: 48, status: "skipped", kg: null },
];

export const mockPayouts: Payout[] = [
  { id: "po-006", tenantId: TENANT, recyclerId: "rec-001", periodStart: "2026-05-01", periodEnd: "2026-05-31", kg: 8320, amountCop: 2912000, status: "paid", createdAt: "2026-06-02" },
  { id: "po-005", tenantId: TENANT, recyclerId: "rec-001", periodStart: "2026-04-01", periodEnd: "2026-04-30", kg: 7960, amountCop: 2786000, status: "paid", createdAt: "2026-05-02" },
  { id: "po-004", tenantId: TENANT, recyclerId: "rec-001", periodStart: "2026-03-01", periodEnd: "2026-03-31", kg: 8110, amountCop: 2838500, status: "paid", createdAt: "2026-04-02" },
];
