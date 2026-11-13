import { vi } from "vitest";
import areas from "@/areas";
import { resetBattleClock } from "@/game/battleClock";
import { loadSave } from "@/hooks/useGameStore";
import { createPokemon } from "@/utils";

// Makes Math.random return `value` until mocks are restored.
export const fixRandom = (value) =>
  vi.spyOn(Math, "random").mockReturnValue(value);

// Some hexes sit on the border of two areas. Tests that care which area a hex
// belongs to use one that is only in the named area.
export const hexOnlyIn = (areaName) => {
  const area = areas.find((a) => a.name === areaName);
  const hex = area.hexes.find(
    (h) =>
      areas.filter((a) => a.hexes.some((x) => x.q === h.q && x.r === h.r))
        .length === 1
  );
  return { q: hex.q, r: hex.r };
};

// A non-shiny Pokémon with a fixed uuid and gender, so tests are repeatable.
export const pokemon = (name, level, overrides = {}) => ({
  ...createPokemon(name, level, `${name}-${level}`, false, 0, 0, "male"),
  ...overrides,
});

// Starts a new game, plus whatever the test passes in.
export const startGame = ({ player = {}, ...rest } = {}) => {
  resetBattleClock();
  loadSave({ ...rest, player: { party: [], ...player } });
};

// Puts the player in the wild at `hex` facing `enemy`.
export const startWildBattle = (
  enemy,
  { party, hex = hexOnlyIn("Area 1") } = {}
) => {
  startGame({
    player: {
      party: party ?? [pokemon("bulbasaur", 10)],
      currentHex: hex,
      isInTown: false,
      unlockedAreas: ["Home", "Area 1"],
    },
    battle: { pokemon: [enemy], isTrainer: false, turn: 0, isComplete: false },
  });
};
