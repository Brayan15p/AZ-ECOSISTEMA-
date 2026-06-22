import {
  LEVELS,
  BADGES,
  levelForPoints,
  nextLevel,
  progressToNext,
  isStreakAlive,
  pointsForAuditScore
} from "./gamification";

describe("levelForPoints", () => {
  it("returns bronze for 0 points", () => {
    expect(levelForPoints(0).level).toBe("bronze");
  });

  it("returns the exact level at its minPoints boundary", () => {
    expect(levelForPoints(200).level).toBe("silver");
    expect(levelForPoints(450).level).toBe("gold");
    expect(levelForPoints(800).level).toBe("platinum");
  });

  it("returns the level just below the next boundary", () => {
    expect(levelForPoints(199).level).toBe("bronze");
    expect(levelForPoints(449).level).toBe("silver");
    expect(levelForPoints(799).level).toBe("gold");
  });

  it("returns platinum for points far beyond its threshold", () => {
    expect(levelForPoints(10_000).level).toBe("platinum");
  });
});

describe("nextLevel", () => {
  it("returns silver after bronze", () => {
    expect(nextLevel(0)?.level).toBe("silver");
  });

  it("returns null once at the top level", () => {
    expect(nextLevel(800)).toBeNull();
    expect(nextLevel(10_000)).toBeNull();
  });
});

describe("progressToNext", () => {
  it("computes ratio 0 right at a level's minPoints", () => {
    const result = progressToNext(0);
    expect(result.current.level).toBe("bronze");
    expect(result.next?.level).toBe("silver");
    expect(result.ratio).toBe(0);
    expect(result.pointsToNext).toBe(200);
  });

  it("computes a midpoint ratio between two levels", () => {
    const result = progressToNext(100);
    expect(result.ratio).toBeCloseTo(0.5);
    expect(result.pointsToNext).toBe(100);
  });

  it("returns ratio 1 and no next level at the max level", () => {
    const result = progressToNext(800);
    expect(result.next).toBeNull();
    expect(result.ratio).toBe(1);
    expect(result.pointsToNext).toBe(0);
  });
});

describe("LEVELS / BADGES data integrity", () => {
  it("is sorted ascending by minPoints", () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i]!.minPoints).toBeGreaterThan(LEVELS[i - 1]!.minPoints);
    }
  });

  it("has unique badge ids", () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("isStreakAlive", () => {
  const now = new Date("2026-06-22T12:00:00Z");

  it("is false when there is no last audit", () => {
    expect(isStreakAlive(null, now)).toBe(false);
  });

  it("is true within the 36h grace period", () => {
    const last = new Date(now.getTime() - 35 * 3600 * 1000).toISOString();
    expect(isStreakAlive(last, now)).toBe(true);
  });

  it("is true exactly at the 36h boundary", () => {
    const last = new Date(now.getTime() - 36 * 3600 * 1000).toISOString();
    expect(isStreakAlive(last, now)).toBe(true);
  });

  it("is false just past the 36h grace period", () => {
    const last = new Date(now.getTime() - 36 * 3600 * 1000 - 1).toISOString();
    expect(isStreakAlive(last, now)).toBe(false);
  });
});

describe("pointsForAuditScore", () => {
  it.each([
    [100, 25],
    [95, 25],
    [94, 18],
    [90, 18],
    [89, 12],
    [80, 12],
    [79, 6],
    [70, 6],
    [69, 2],
    [60, 2],
    [59, 0],
    [0, 0]
  ])("score %i awards %i points", (score, expected) => {
    expect(pointsForAuditScore(score)).toBe(expected);
  });
});
