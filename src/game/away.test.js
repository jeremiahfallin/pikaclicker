import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useGameStore from "@/hooks/useGameStore";
import { catchUpBattle } from "@/game/battleClock";
import {
  AWAY_SUMMARY_MS,
  LIVE_LIMIT_MS,
  MAX_AWAY_MS,
  formatDuration,
  planCatchUp,
  progressSnapshot,
  readLastBattle,
  recordLastBattle,
  summarizeProgress,
} from "@/game/away";
import { pokemon, startGame, startWildBattle } from "@/test/helpers";

const state = () => useGameStore.getState();
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

beforeEach(() => {
  startGame();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("planCatchUp", () => {
  it("plays short gaps straight away", () => {
    expect(planCatchUp(16, { isTrainer: false })).toEqual({
      mode: "live",
      ms: 16,
    });
    expect(planCatchUp(LIVE_LIMIT_MS, { isTrainer: false }).mode).toBe("live");
  });

  it("catches up longer gaps in wild battles, quietly for short ones", () => {
    expect(planCatchUp(LIVE_LIMIT_MS + 1, { isTrainer: false })).toEqual({
      mode: "catch-up",
      ms: LIVE_LIMIT_MS + 1,
      showSummary: false,
    });
    expect(planCatchUp(AWAY_SUMMARY_MS, { isTrainer: false })).toMatchObject({
      mode: "catch-up",
      showSummary: true,
    });
  });

  it("credits at most 8 hours", () => {
    expect(planCatchUp(20 * HOUR, { isTrainer: false })).toMatchObject({
      mode: "catch-up",
      ms: MAX_AWAY_MS,
    });
    expect(MAX_AWAY_MS).toBe(8 * HOUR);
  });

  it("never catches up a gym battle in the background", () => {
    expect(planCatchUp(2 * HOUR, { isTrainer: true })).toEqual({
      mode: "live",
      ms: 10 * MINUTE,
    });
  });
});

describe("formatDuration", () => {
  it.each([
    [0, "0s"],
    [30 * 1000, "30s"],
    [45 * MINUTE, "45m"],
    [3 * HOUR, "3h"],
    [2 * HOUR + 5 * MINUTE, "2h 5m"],
  ])("formats %i ms as %s", (ms, text) => {
    expect(formatDuration(ms)).toBe(text);
  });
});

describe("summarizeProgress", () => {
  it("reports what changed", () => {
    const lead = pokemon("bulbasaur", 10, { pokemonKnockedOut: 5 });
    startGame({
      player: {
        party: [lead],
        isInTown: false,
        pokedex: { seen: [1], caught: [1] },
      },
    });
    const before = progressSnapshot(state());

    startGame({
      player: {
        party: [
          { ...lead, level: 12, pokemonKnockedOut: 12 },
          pokemon("pikachu", 5),
        ],
        bank: [pokemon("weedle", 4)],
        coins: 1500,
        items: [{ name: "Pokeball", quantity: 7, type: "ball" }],
        isInTown: true,
        pokedex: { seen: [1, 13, 25], caught: [1, 13, 25] },
      },
    });
    const after = progressSnapshot(state());

    expect(summarizeProgress(before, after)).toEqual({
      coins: 500,
      defeated: 7,
      caught: 2,
      newSpecies: 2,
      levels: 2,
      ballsUsed: 3,
      sentHome: true,
    });
  });

  it("adds up a real catch-up", async () => {
    const strong = pokemon("bulbasaur", 60, {
      maxHP: 1e9,
      currentHP: 1e9,
      speed: 200,
    });
    startWildBattle(pokemon("weedle", 3), { party: [strong] });
    const before = progressSnapshot(state());

    await catchUpBattle(10 * MINUTE);

    const summary = summarizeProgress(before, progressSnapshot(state()));
    expect(summary.defeated).toBeGreaterThan(10);
    // Every knockout is worth at least 10 coins.
    expect(summary.coins).toBeGreaterThanOrEqual(10 * summary.defeated);
    expect(summary.sentHome).toBe(false);
  });
});

describe("last battle time", () => {
  it("remembers when and where the last battle ran", () => {
    recordLastBattle(1234, true);
    expect(readLastBattle()).toEqual({ at: 1234, wild: true });
  });

  it("ignores a missing or damaged record", () => {
    expect(readLastBattle()).toBeNull();
    localStorage.setItem("pokeclicker-last-battle", "{oops");
    expect(readLastBattle()).toBeNull();
  });
});
