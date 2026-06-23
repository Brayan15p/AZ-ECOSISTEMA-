import { describe, it, expect } from "vitest";
import { scoreLevel, scoreLabel, clampScore } from "../scoring";
import { dayTotal, periodBalance } from "../mass-balance";
import { pointsBalance, canRedeem } from "../points";
import type { DailyData, CatalogItem, PointsEntry } from "../types";

const mkDay = (over: Partial<DailyData>): DailyData => ({
  id: "d",
  tenantId: "t",
  date: "2026-06-16",
  organic: 5.9,
  recyclable: 1.6,
  energy: 2.0,
  reject: 0.5,
  purity: 90,
  ...over,
});

describe("scoring", () => {
  it("clasifica niveles según umbrales del prototipo", () => {
    expect(scoreLevel(95)).toBe("excelente");
    expect(scoreLevel(78)).toBe("cumple");
    expect(scoreLevel(65)).toBe("reentrenamiento");
    expect(scoreLevel(52)).toBe("incumplimiento");
  });
  it("etiqueta y normaliza", () => {
    expect(scoreLabel(92)).toBe("Excelente");
    expect(clampScore(150)).toBe(100);
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(NaN)).toBe(0);
  });
});

describe("balance de masas", () => {
  it("suma el total del día (= 10.0 t como en el prototipo)", () => {
    expect(dayTotal(mkDay({}))).toBe(10);
  });
  it("agrega un periodo y calcula tasa de desviación", () => {
    const week = [
      mkDay({ date: "2026-06-15", organic: 6.2, recyclable: 1.5, energy: 1.7, reject: 0.6, purity: 88 }),
      mkDay({ date: "2026-06-16", organic: 5.9, recyclable: 1.6, energy: 2.0, reject: 0.5, purity: 90 }),
    ];
    const p = periodBalance(week);
    expect(p.days).toBe(2);
    expect(p.totalTons).toBe(20);
    expect(p.avgPurity).toBe(89);
    // desviado = total - rechazo = 20 - 1.1 = 18.9 -> 94.5%
    expect(p.diversionRate).toBe(94.5);
  });
});

describe("puntos", () => {
  const ledger: PointsEntry[] = [
    { id: "1", tenantId: "t", householdId: "h", delta: 450, reason: "score", createdAt: "" },
    { id: "2", tenantId: "t", householdId: "h", delta: -100, reason: "canje", createdAt: "" },
  ];
  it("calcula saldo", () => {
    expect(pointsBalance(ledger)).toBe(350);
  });
  it("valida canje", () => {
    const item: CatalogItem = {
      id: "c", tenantId: "t", name: "Bono", description: "", costPoints: 300, priceCop: 0, stock: 5, active: true,
    };
    expect(canRedeem(item, 350)).toEqual({ ok: true });
    expect(canRedeem(item, 200)).toEqual({ ok: false, reason: "insufficient_points" });
    expect(canRedeem({ ...item, stock: 0 }, 350)).toEqual({ ok: false, reason: "out_of_stock" });
  });
});
