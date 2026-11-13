import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useGameStore from "@/hooks/useGameStore";
import {
  advanceBattle,
  catchUpBattle,
  getTurnProgress,
  turnInterval,
} from "@/game/battleClock";
import {
  fixRandom,
  pokemon,
  startGame,
  startWildBattle,
} from "@/test/helpers";

const state = () => useGameStore.getState();
const lead = () => state().player.party[0];
const enemy = () => state().battle.pokemon[0];

// A Pokémon with a set speed and enough HP to never faint during a test.
const tank = (name, speed) =>
  pokemon(name, 30, { speed, maxHP: 1e9, currentHP: 1e9 });

// Player turns every second, enemy turns every two seconds.
const startEvenBattle = () =>
  startWildBattle(tank("pikachu", 50), { party: [tank("bulbasaur", 100)] });

beforeEach(() => {
  startGame();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("turnInterval", () => {
  it("gives a turn every 100 / speed seconds", () => {
    expect(turnInterval(50)).toBe(2000);
    expect(turnInterval(100)).toBe(1000);
  });

  it("treats a missing or zero speed as speed 1", () => {
    expect(turnInterval(0)).toBe(100000);
    expect(turnInterval(undefined)).toBe(100000);
  });
});

describe("advanceBattle", () => {
  it("takes each side's turn when it comes due", () => {
    fixRandom(0.5);
    startEvenBattle();

    advanceBattle(999);
    expect(enemy().currentHP).toBe(1e9);
    expect(lead().currentHP).toBe(1e9);

    advanceBattle(1);
    expect(enemy().currentHP).toBeLessThan(1e9);
    expect(lead().currentHP).toBe(1e9);
    expect(state().battle.turn).toBe(1);

    advanceBattle(1000);
    expect(lead().currentHP).toBeLessThan(1e9);
    expect(state().battle.turn).toBe(2);
  });

  it("lets the player move first when both turns are due", () => {
    fixRandom(0.5);
    const lead = pokemon("bulbasaur", 30, { speed: 100, currentHP: 1 });
    const foe = pokemon("pikachu", 30, { speed: 100, currentHP: 1 });
    startWildBattle(foe, { party: [lead] });

    advanceBattle(1000);

    // The player knocks the foe out before it can attack.
    expect(state().player.party[0].currentHP).toBe(1);
    expect(state().player.isInTown).toBe(false);
  });

  it("ends up in the same place in one long step or many short ones", () => {
    fixRandom(0.5);
    startEvenBattle();
    advanceBattle(10000);
    const oneStep = { enemy: enemy().currentHP, lead: lead().currentHP };
    expect(state().battle.turn).toBe(10);

    startEvenBattle();
    for (let i = 0; i < 100; i++) advanceBattle(100);

    expect(state().battle.turn).toBe(10);
    expect(enemy().currentHP).toBe(oneStep.enemy);
    expect(lead().currentHP).toBe(oneStep.lead);
  });

  it("restarts the clock for a new opponent", () => {
    fixRandom(0.5);
    const fainted = pokemon("pikachu", 5, { speed: 50, currentHP: 0 });
    const next = tank("weedle", 50);
    startGame({
      player: { party: [tank("bulbasaur", 100)] },
      battle: { pokemon: [fainted, next], isTrainer: true, isComplete: false },
    });

    advanceBattle(1000); // the lead's turn sends out the trainer's next Pokémon
    expect(enemy().uuid).toBe(next.uuid);
    expect(getTurnProgress()).toEqual({ player: 0, enemy: 0 });

    advanceBattle(999);
    expect(enemy().currentHP).toBe(1e9);
    advanceBattle(1);
    expect(enemy().currentHP).toBeLessThan(1e9);
  });

  it("stops after the turn limit and returns the time left over", () => {
    fixRandom(0.5);
    startEvenBattle();

    // Turns come at 1s (player), 2s (player) and 2s (enemy).
    expect(advanceBattle(10000, 3)).toBe(8000);
    expect(state().battle.turn).toBe(2);
    expect(lead().currentHP).toBeLessThan(1e9);
  });

  it("does nothing outside a battle", () => {
    startGame({ player: { party: [tank("bulbasaur", 100)] } });
    const before = state();

    expect(advanceBattle(5000)).toBe(0);
    expect(state().player).toBe(before.player);
    expect(state().battle).toBe(before.battle);
  });

  it("sends the player home when the whole party faints", () => {
    fixRandom(0.5);
    const fragile = pokemon("bulbasaur", 5, { speed: 10, currentHP: 1 });
    const brute = pokemon("pikachu", 60, { speed: 200, maxHP: 1e9, currentHP: 1e9 });
    startWildBattle(brute, { party: [fragile] });

    expect(advanceBattle(60000)).toBe(0);
    expect(state().player.isInTown).toBe(true);
    expect(state().battle.pokemon).toBeNull();
  });
});

describe("getTurnProgress", () => {
  it("reports how close each side is to its next turn", () => {
    startEvenBattle();
    advanceBattle(500);
    expect(getTurnProgress()).toEqual({ player: 0.5, enemy: 0.25 });
  });

  it("is zero outside a battle", () => {
    expect(getTurnProgress()).toEqual({ player: 0, enemy: 0 });
  });
});

describe("catchUpBattle", () => {
  it("plays all the time it is given", async () => {
    fixRandom(0.5);
    startEvenBattle();

    await catchUpBattle(100 * 60 * 1000);

    expect(state().battle.turn).toBe(6000);
  });

  it("saves once per step instead of once per turn", async () => {
    fixRandom(0.5);
    startEvenBattle();
    const setItem = vi.spyOn(localStorage, "setItem");

    // 2,000 player turns and 1,000 enemy turns.
    await catchUpBattle(2000 * 1000);

    const saves = setItem.mock.calls.filter(([key]) => key === "pokeclicker");
    expect(saves.length).toBeGreaterThan(0);
    expect(saves.length).toBeLessThanOrEqual(4);
    expect(state().battle.turn).toBe(2000);
  });

  it("updates the screen once per step instead of once per turn", async () => {
    fixRandom(0.5);
    startEvenBattle();
    let notifications = 0;
    const unsubscribe = useGameStore.subscribe(() => notifications++);

    await catchUpBattle(2000 * 1000);
    unsubscribe();

    expect(state().battle.turn).toBe(2000);
    expect(notifications).toBeGreaterThan(0);
    expect(notifications).toBeLessThanOrEqual(4);
  });

  it("stops when asked to", async () => {
    startEvenBattle();
    await catchUpBattle(60000, { shouldStop: () => true });
    expect(state().battle.turn).toBe(0);
  });
});
