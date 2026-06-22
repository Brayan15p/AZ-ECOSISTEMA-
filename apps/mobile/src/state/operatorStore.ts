import { create } from "zustand";
import type { Household, Recycler, Irsu, DailyProcessing, Penalty, Reward, LogEntry, Publication, PenaltySeverity } from "@shared/types";
import { statusFromScore, scoreDeltaForPenalty } from "@shared/index";
import {
  DEMO_HOUSEHOLDS,
  DEMO_RECYCLERS,
  DEMO_IRSUS,
  DEMO_DAILY_DATA,
  DEMO_PENALTIES,
  DEMO_REWARDS,
  DEMO_LOGS,
  DEMO_PUBLICATIONS
} from "@/data/operatorDemoData";

type OperatorState = {
  households: Household[];
  recyclers: Recycler[];
  irsus: Irsu[];
  dailyData: DailyProcessing[];
  penalties: Penalty[];
  rewards: Reward[];
  logs: LogEntry[];
  publications: Publication[];

  addLog: (action: string, detail: string) => void;
  changeHouseholdScore: (id: string, newScore: number) => void;
  addPoints: (id: string, pts: number) => void;
  addPenalty: (householdId: string, type: string, description: string, severity: PenaltySeverity) => void;
  resolvePenalty: (id: string) => void;
  addReward: (householdId: string, type: string, description: string, pts: number) => void;
  addHousehold: (hh: { owner: string; address: string; phone: string; zone: Household["zone"]; irsu: string }) => void;
  addPublication: (pub: { title: string; body: string; category: Publication["category"]; imageUrl?: string | null; videoUrl?: string | null }) => void;
  deletePublication: (id: string) => void;
  addDailyEntry: (entry: Omit<DailyProcessing, "total">) => void;
  resetData: () => void;
};

// TODO: conectar con (ciudadano)/news.tsx cuando exista Supabase real —
// por ahora publications vive solo en este store en memoria.
export const useOperatorStore = create<OperatorState>((set, get) => ({
  households: DEMO_HOUSEHOLDS,
  recyclers: DEMO_RECYCLERS,
  irsus: DEMO_IRSUS,
  dailyData: DEMO_DAILY_DATA,
  penalties: DEMO_PENALTIES,
  rewards: DEMO_REWARDS,
  logs: DEMO_LOGS,
  publications: DEMO_PUBLICATIONS,

  addLog: (action, detail) => {
    const log: LogEntry = { id: `L${Date.now()}`, timestamp: new Date().toISOString(), action, detail };
    set((state) => ({ logs: [log, ...state.logs].slice(0, 200) }));
  },

  changeHouseholdScore: (id, newScore) => {
    const clamped = Math.min(100, Math.max(0, newScore));
    set((state) => ({
      households: state.households.map((h) =>
        h.id === id
          ? { ...h, score: clamped, status: statusFromScore(clamped), lastAuditAt: new Date().toISOString().split("T")[0]! }
          : h
      )
    }));
    get().addLog("Puntuación", `${id} → ${clamped} puntos (${statusFromScore(clamped)})`);
  },

  addPoints: (id, pts) => {
    set((state) => ({
      households: state.households.map((h) => (h.id === id ? { ...h, points: h.points + pts } : h))
    }));
    get().addLog("Puntos", `+${pts} puntos a ${id}`);
  },

  addPenalty: (householdId, type, description, severity) => {
    const penalty: Penalty = {
      id: `P${Date.now()}`,
      householdId,
      date: new Date().toISOString().split("T")[0]!,
      type,
      description,
      severity,
      resolved: false
    };
    const hh = get().households.find((h) => h.id === householdId);
    const scoreDelta = scoreDeltaForPenalty(severity);
    set((state) => ({
      penalties: [penalty, ...state.penalties],
      households: state.households.map((h) => {
        if (h.id !== householdId) return h;
        const newScore = Math.max(0, h.score + scoreDelta);
        return { ...h, penaltiesCount: h.penaltiesCount + 1, score: newScore, status: statusFromScore(newScore) };
      })
    }));
    get().addLog("Penalización", `${type} (${severity}) a ${householdId} — ${hh?.ownerName ?? ""}`);
  },

  resolvePenalty: (id) => {
    set((state) => ({
      penalties: state.penalties.map((p) => (p.id === id ? { ...p, resolved: true } : p))
    }));
  },

  addReward: (householdId, type, description, pts) => {
    const reward: Reward = { id: `RW${Date.now()}`, householdId, date: new Date().toISOString().split("T")[0]!, type, description, points: pts };
    set((state) => ({
      rewards: [reward, ...state.rewards],
      households: state.households.map((h) => (h.id === householdId ? { ...h, rewardsCount: h.rewardsCount + 1, points: h.points + pts } : h))
    }));
    get().addLog("Reconocimiento", `${type} (+${pts} pts) a ${householdId}`);
  },

  addHousehold: (hh) => {
    const id = `H${String(get().households.length + 1).padStart(3, "0")}`;
    const newHH: Household = {
      id,
      ownerName: hh.owner,
      address: hh.address,
      phone: hh.phone || null,
      zone: hh.zone,
      score: 70,
      status: "Cumple",
      points: 0,
      penaltiesCount: 0,
      rewardsCount: 0,
      lastAuditAt: new Date().toISOString().split("T")[0]!,
      irsuId: hh.irsu
    };
    set((state) => ({ households: [...state.households, newHH] }));
    get().addLog("Nuevo hogar", `${id} — ${hh.owner} — ${hh.address}`);
  },

  addPublication: (pub) => {
    const newPub: Publication = {
      id: `PUB${Date.now()}`,
      title: pub.title,
      body: pub.body,
      category: pub.category,
      authorId: "operador-demo",
      imageUrl: pub.imageUrl ?? null,
      videoUrl: pub.videoUrl ?? null,
      publishedAt: new Date().toISOString()
    };
    set((state) => ({ publications: [newPub, ...state.publications].slice(0, 50) }));
    get().addLog("Publicación", `${pub.category}: ${pub.title}`);
  },

  deletePublication: (id) => {
    set((state) => ({ publications: state.publications.filter((p) => p.id !== id) }));
  },

  addDailyEntry: (entry) => {
    const total = +(entry.organic + entry.recyclable + entry.energy + entry.reject).toFixed(1);
    const full: DailyProcessing = { ...entry, total };
    set((state) => ({ dailyData: [...state.dailyData.slice(-29), full] }));
    get().addLog("Datos diarios", `Total: ${total} ton | Pureza: ${entry.purity}%`);
  },

  resetData: () => {
    set({
      households: DEMO_HOUSEHOLDS,
      recyclers: DEMO_RECYCLERS,
      irsus: DEMO_IRSUS,
      dailyData: DEMO_DAILY_DATA,
      penalties: DEMO_PENALTIES,
      rewards: DEMO_REWARDS,
      logs: [],
      publications: []
    });
  }
}));
