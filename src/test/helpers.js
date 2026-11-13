import { vi } from "vitest";
import areas from "@/areas";
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
