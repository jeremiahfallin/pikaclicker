import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useGameStore, { batchUpdates } from "@/hooks/useGameStore";
import { onHit } from "@/game/battleEvents";
import { fixRandom, pokemon, startGame, startWildBattle } from "@/test/helpers";

const state = () => useGameStore.getState();

let hits;
let stopListening;

beforeEach(() => {
  startGame();
  hits = [];
  stopListening = onHit((hit) => hits.push(hit));
});

afterEach(() => {
  stopListening();
  vi.restoreAllMocks();
});

describe("hits reported to the battle screen", () => {
  it("reports a click on the wild Pokémon with the damage it did", () => {
    fixRandom(0.5);
    const enemy = pokemon("pikachu", 5);
    startWildBattle(enemy);

    state().handleClick();

    const hpLost = enemy.maxHP - state().battle.pokemon[0].currentHP;
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      target: "enemy",
      source: "click",
      critical: false,
    });
    expect(hits[0].damage).toBeCloseTo(hpLost);
  });

  it("reports the player's attack on its turn", () => {
    fixRandom(0.5);
    const enemy = pokemon("pikachu", 5);
    startWildBattle(enemy);

    state().handleTurn("player");

    const hpLost = enemy.maxHP - state().battle.pokemon[0].currentHP;
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      target: "enemy",
      source: "turn",
      critical: false,
    });
    expect(hits[0].damage).toBeCloseTo(hpLost);
  });

  it("marks a critical hit", () => {
    fixRandom(0); // a critical every time
    startWildBattle(pokemon("pikachu", 50));

    state().handleTurn("player");

    expect(hits[0]).toMatchObject({ target: "enemy", critical: true });
  });

  it("reports the wild Pokémon's attack on the player", () => {
    fixRandom(0.5);
    startWildBattle(pokemon("pikachu", 5));
    const lead = state().player.party[0];

    state().handleTurn();

    const hpLost = lead.currentHP - state().player.party[0].currentHP;
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      target: "player",
      source: "turn",
      critical: false,
    });
    expect(hits[0].damage).toBeCloseTo(hpLost);
  });

  it("reports nothing for clicking a Pokémon that's already knocked out", () => {
    fixRandom(0.9999);
    startWildBattle(pokemon("pikachu", 9, { currentHP: 0 }));

    state().handleClick();

    expect(hits).toEqual([]);
  });

  it("reports nothing while catching up on time away", () => {
    fixRandom(0.5);
    startWildBattle(pokemon("pikachu", 5));

    batchUpdates(() => {
      state().handleTurn("player");
      state().handleTurn();
      state().handleClick();
    });

    expect(hits).toEqual([]);
  });

  it("stops telling a listener once it stops listening", () => {
    fixRandom(0.5);
    startWildBattle(pokemon("pikachu", 5));
    stopListening();

    state().handleClick();

    expect(hits).toEqual([]);
  });
});
