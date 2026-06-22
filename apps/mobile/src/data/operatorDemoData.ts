import type {
  Household,
  Recycler,
  Irsu,
  DailyProcessing,
  Penalty,
  Reward,
  LogEntry,
  Publication
} from "@shared/types";

export const DEMO_HOUSEHOLDS: Household[] = [
  { id: "H001", address: "Cra 19 #14-22, B. Centro", ownerName: "María García", phone: "3201234567", zone: "Centro", score: 92, status: "Excelente", points: 450, penaltiesCount: 0, rewardsCount: 3, lastAuditAt: "2026-06-10", irsuId: "IRSU-001" },
  { id: "H002", address: "Cl 20 #8-45, B. Meridiano", ownerName: "Carlos Pérez", phone: "3109876543", zone: "Meridiano", score: 78, status: "Cumple", points: 280, penaltiesCount: 1, rewardsCount: 1, lastAuditAt: "2026-06-12", irsuId: "IRSU-002" },
  { id: "H003", address: "Cra 22 #18-10, B. El Bosque", ownerName: "Ana Rodríguez", phone: "3157654321", zone: "El Bosque", score: 65, status: "Reentrenamiento", points: 120, penaltiesCount: 2, rewardsCount: 0, lastAuditAt: "2026-06-08", irsuId: "IRSU-001" },
  { id: "H004", address: "Cl 15 #12-30, B. Unión", ownerName: "Jorge Martínez", phone: "3004567890", zone: "Unión", score: 95, status: "Excelente", points: 580, penaltiesCount: 0, rewardsCount: 5, lastAuditAt: "2026-06-14", irsuId: "IRSU-003" },
  { id: "H005", address: "Cra 25 #9-15, B. San Luis", ownerName: "Laura Sánchez", phone: "3183456789", zone: "San Luis", score: 52, status: "Incumplimiento", points: 40, penaltiesCount: 4, rewardsCount: 0, lastAuditAt: "2026-06-05", irsuId: "IRSU-002" }
];

export const DEMO_RECYCLERS: Recycler[] = [
  { id: "R001", name: "Pedro López", phone: "3201112233", zone: "Centro", households: 300, kgDay: 420, status: "Activo", formalized: true },
  { id: "R002", name: "Martha Díaz", phone: "3104445566", zone: "Meridiano", households: 280, kgDay: 380, status: "Activo", formalized: true },
  { id: "R003", name: "José Ramírez", phone: "3157778899", zone: "El Bosque", households: 310, kgDay: 440, status: "Activo", formalized: true }
];

export const DEMO_IRSUS: Irsu[] = [
  { id: "IRSU-001", name: "Sandra Morales", zone: "Centro + El Bosque", households: 420, avgScore: 78.5 },
  { id: "IRSU-002", name: "Diego Castro", zone: "Meridiano + San Luis", households: 380, avgScore: 65.0 },
  { id: "IRSU-003", name: "Paola Ríos", zone: "Unión + Norte", households: 350, avgScore: 88.2 }
];

export const DEMO_DAILY_DATA: DailyProcessing[] = [
  { date: "2026-06-10", organic: 5.8, recyclable: 1.6, energy: 1.9, reject: 0.7, total: 10.0, purity: 87 },
  { date: "2026-06-11", organic: 6.1, recyclable: 1.5, energy: 1.8, reject: 0.6, total: 10.0, purity: 89 },
  { date: "2026-06-12", organic: 5.9, recyclable: 1.7, energy: 2.0, reject: 0.4, total: 10.0, purity: 91 },
  { date: "2026-06-13", organic: 6.0, recyclable: 1.4, energy: 1.9, reject: 0.7, total: 10.0, purity: 86 },
  { date: "2026-06-14", organic: 5.7, recyclable: 1.8, energy: 2.1, reject: 0.4, total: 10.0, purity: 92 },
  { date: "2026-06-15", organic: 6.2, recyclable: 1.5, energy: 1.7, reject: 0.6, total: 10.0, purity: 88 },
  { date: "2026-06-16", organic: 5.9, recyclable: 1.6, energy: 2.0, reject: 0.5, total: 10.0, purity: 90 }
];

export const DEMO_PENALTIES: Penalty[] = [
  { id: "P001", householdId: "H003", date: "2026-06-08", type: "Contaminación cruzada", description: "Orgánicos en bolsa blanca", severity: "Leve", resolved: false },
  { id: "P002", householdId: "H005", date: "2026-06-05", type: "No clasificación", description: "Todo mezclado en una sola bolsa", severity: "Grave", resolved: false }
];

export const DEMO_REWARDS: Reward[] = [
  { id: "RW001", householdId: "H001", date: "2026-06-10", type: "Descuento tarifa", description: "10% descuento servicio de aseo", points: 100 },
  { id: "RW002", householdId: "H004", date: "2026-06-14", type: "Bono comercial", description: "COP $20.000 en comercio local", points: 150 }
];

export const DEMO_LOGS: LogEntry[] = [];

export const DEMO_PUBLICATIONS: Publication[] = [];
