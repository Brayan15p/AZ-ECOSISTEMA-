import { SCORE_THRESHOLDS, statusFromScore, isPassing } from "./scoring";

describe("statusFromScore", () => {
  it("returns Excelente at and above the excellent threshold", () => {
    expect(statusFromScore(SCORE_THRESHOLDS.excellent)).toBe("Excelente");
    expect(statusFromScore(100)).toBe("Excelente");
  });

  it("returns Cumple between good and excellent thresholds", () => {
    expect(statusFromScore(SCORE_THRESHOLDS.good)).toBe("Cumple");
    expect(statusFromScore(SCORE_THRESHOLDS.excellent - 1)).toBe("Cumple");
  });

  it("returns Reentrenamiento between warning and good thresholds", () => {
    expect(statusFromScore(SCORE_THRESHOLDS.warning)).toBe("Reentrenamiento");
    expect(statusFromScore(SCORE_THRESHOLDS.good - 1)).toBe("Reentrenamiento");
  });

  it("returns Incumplimiento below the warning threshold", () => {
    expect(statusFromScore(SCORE_THRESHOLDS.warning - 1)).toBe("Incumplimiento");
    expect(statusFromScore(0)).toBe("Incumplimiento");
  });
});

describe("isPassing", () => {
  it("is true at and above the warning threshold", () => {
    expect(isPassing(SCORE_THRESHOLDS.warning)).toBe(true);
    expect(isPassing(100)).toBe(true);
  });

  it("is false below the warning threshold", () => {
    expect(isPassing(SCORE_THRESHOLDS.warning - 1)).toBe(false);
    expect(isPassing(0)).toBe(false);
  });
});
