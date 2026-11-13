import { afterEach, describe, expect, it, vi } from "vitest";
import areas from "@/areas";
import pokes from "@/pokes";
import { fixRandom, hexOnlyIn } from "@/test/helpers";
import {
  axialDistance,
  calcDamage,
  calcMaxHP,
  calcStat,
  catchChance,
  checkEvolve,
  createPokemon,
  determineSpawn,
  erraticGrowth,
  experienceGain,
  fastGrowth,
  fluctuatingGrowth,
  getHexDetails,
  getWildPokemon,
  homeHex,
  mediumFastGrowth,
  mediumSlowGrowth,
  pokesByName,
  random,
  slowGrowth,
} from "@/utils";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("random", () => {
  it("includes the minimum and excludes the maximum", () => {
    fixRandom(0);
    expect(random(3, 7)).toBe(3);
    fixRandom(0.9999);
    expect(random(3, 7)).toBe(6);
  });
});

describe("axialDistance", () => {
  it("counts the hex steps between two hexes", () => {
    expect(axialDistance({ q: 0, r: 0 }, { q: 0, r: 0 })).toBe(0);
    expect(axialDistance({ q: 0, r: 0 }, { q: 1, r: 0 })).toBe(1);
    expect(axialDistance({ q: 0, r: 0 }, { q: 2, r: -1 })).toBe(2);
    expect(axialDistance({ q: 2, r: -1 }, { q: 0, r: 0 })).toBe(2);
  });
});

describe("stats", () => {
  it("scales max HP and stats with level", () => {
    expect(calcMaxHP(45, 5)).toBe(20);
    expect(calcMaxHP(45, 50)).toBe(105);
    expect(calcStat(49, 5)).toBe(10);
    expect(calcStat(49, 50)).toBe(54);
  });

  it("calculates damage within the 85-100% random roll", () => {
    fixRandom(0);
    expect(calcDamage(50, 100, 20, 100, 1, 1)).toBeCloseTo(10.8 * 0.85);
    fixRandom(0.9999);
    expect(calcDamage(50, 100, 20, 100, 1, 1)).toBeCloseTo(10.8 * 0.99);
  });

  it("deals more damage against a weaker defense", () => {
    fixRandom(0.5);
    expect(calcDamage(20, 50, 20, 25, 1, 1)).toBeGreaterThan(
      calcDamage(20, 50, 20, 100, 1, 1)
    );
  });
});

describe("catchChance", () => {
  it("is higher when the Pokémon has less HP", () => {
    const full = catchChance(45, 100, 100, 1, 1, 30);
    const low = catchChance(45, 1, 100, 1, 1, 30);
    expect(low).toBeGreaterThan(full);
  });

  it("is higher with a better ball", () => {
    const pokeball = catchChance(45, 50, 100, 1, 1, 30);
    const ultraBall = catchChance(45, 50, 100, 1, 2, 30);
    expect(ultraBall).toBeGreaterThan(pokeball);
  });

  it("never exceeds 100%", () => {
    expect(catchChance(255, 1, 100, 1, 255, 1)).toBe(100);
  });
});

describe("growth rates", () => {
  it("matches the known experience totals at level 10", () => {
    expect(fastGrowth(10)).toBe(800);
    expect(mediumFastGrowth(10)).toBe(1000);
    expect(mediumSlowGrowth(10)).toBe(560);
    expect(slowGrowth(10)).toBe(1250);
  });

  it("tops out at the known totals at level 100", () => {
    expect(erraticGrowth(100)).toBe(600000);
    expect(fastGrowth(100)).toBe(800000);
    expect(mediumFastGrowth(100)).toBe(1000000);
    expect(slowGrowth(100)).toBe(1250000);
    expect(fluctuatingGrowth(100)).toBe(1640000);
  });

  it.each([
    ["erratic", erraticGrowth],
    ["fast", fastGrowth],
    ["medium-fast", mediumFastGrowth],
    ["medium-slow", mediumSlowGrowth],
    ["slow", slowGrowth],
    ["fluctuating", fluctuatingGrowth],
  ])("%s needs more experience for every level from 2 to 100", (_, growth) => {
    for (let level = 3; level <= 100; level++) {
      expect(growth(level)).toBeGreaterThan(growth(level - 1));
    }
  });
});

describe("experienceGain", () => {
  it("gives more experience for beating a higher-level Pokémon", () => {
    expect(experienceGain(64, 20, 10)).toBeGreaterThan(
      experienceGain(64, 10, 10)
    );
  });

  it("gives nothing for a Pokémon without base experience", () => {
    expect(experienceGain(null, 10, 10)).toBe(0);
  });
});

describe("createPokemon", () => {
  it("builds a Pokémon at full health with stats for its level", () => {
    const bulbasaur = createPokemon("bulbasaur", 5, "uuid-1", false, 0, 0, "male");
    expect(bulbasaur).toMatchObject({
      uuid: "uuid-1",
      id: 1,
      name: "bulbasaur",
      level: 5,
      isShiny: false,
      gender: "male",
      growthRate: "medium-slow",
      xp: mediumSlowGrowth(5),
    });
    expect(bulbasaur.currentHP).toBe(bulbasaur.maxHP);
    expect(bulbasaur.image).toBe(pokesByName.bulbasaur.sprites.front_default);
  });

  it("uses the shiny sprite for shiny Pokémon", () => {
    const shiny = createPokemon("bulbasaur", 5, "uuid-1", true);
    expect(shiny.image).toBe(pokesByName.bulbasaur.sprites.front_shiny);
  });

  it("makes species without a gender genderless", () => {
    expect(createPokemon("gimmighoul", 5, "uuid-1", false).gender).toBe(
      "genderless"
    );
  });

  it("gives each Pokémon its own uuid by default", () => {
    const a = createPokemon("bulbasaur", 5);
    const b = createPokemon("bulbasaur", 5);
    expect(a.uuid).toBeTruthy();
    expect(a.uuid).not.toBe(b.uuid);
  });
});

describe("checkEvolve", () => {
  const bulbasaur = (level) =>
    createPokemon("bulbasaur", level, "uuid-1", false, 0, 0, "male");

  it("evolves by level once the level is reached", () => {
    expect(checkEvolve(bulbasaur(15), 15)).toBe(false);
    expect(checkEvolve(bulbasaur(15), 16)).toBe("ivysaur");
  });

  it("evolves with the matching item", () => {
    const eevee = createPokemon("eevee", 20, "uuid-1", false);
    expect(checkEvolve(eevee, null, null, "water-stone")).toBe("vaporeon");
    expect(checkEvolve(eevee, null, null, "fire-stone")).toBe("flareon");
    expect(checkEvolve(eevee, null, null, "dawn-stone")).toBe(false);
  });

  it("evolves Bisharp after it knocks out more than 100 Bisharp", () => {
    const bisharp = (knockOuts) =>
      createPokemon("bisharp", 50, "uuid-1", false, 0, knockOuts);
    expect(checkEvolve(bisharp(100), 51)).toBe(false);
    expect(checkEvolve(bisharp(101), 51)).toBe("kingambit");
  });

  it("does not evolve Pokémon without evolutions", () => {
    expect(checkEvolve(createPokemon("kingambit", 50), 51)).toBe(false);
  });
});

describe("determineSpawn", () => {
  it("picks by rarity weight across the list", () => {
    fixRandom(0);
    expect(determineSpawn(["bulbasaur", "pikachu"])).toBe("bulbasaur");
    fixRandom(0.9999);
    expect(determineSpawn(["bulbasaur", "pikachu"])).toBe("pikachu");
  });

  it("never picks a name it has no data for", () => {
    fixRandom(0.9999);
    expect(determineSpawn(["bulbasaur", "not-a-pokemon"])).toBe("bulbasaur");
  });
});

describe("map", () => {
  it("treats the home hex as a town with no wild Pokémon", () => {
    const home = getHexDetails(homeHex.q, homeHex.r);
    expect(home).toMatchObject({ name: "Home", isTown: true, pokemon: [] });
  });

  it("spawns wild Pokémon from the area within its level range", () => {
    const area1 = areas.find((area) => area.name === "Area 1");
    const { q, r } = hexOnlyIn("Area 1");
    const hex = getHexDetails(q, r);
    expect(hex.isTown).toBe(false);
    for (let i = 0; i < 50; i++) {
      const wild = getWildPokemon(hex);
      expect(area1.pokemon).toContain(wild.name);
      expect(wild.level).toBeGreaterThanOrEqual(area1.minLevel);
      expect(wild.level).toBeLessThan(area1.maxLevel);
    }
  });
});

describe("game data", () => {
  it("only lists Pokémon in areas that exist in pokes.json", () => {
    for (const area of areas) {
      for (const name of area.pokemon) {
        expect(pokesByName, `${area.name}: ${name}`).toHaveProperty([name]);
      }
    }
  });

  it("only evolves into Pokémon that exist in pokes.json", () => {
    for (const pokemon of pokes) {
      for (const evolution of pokemon.evolvesTo ?? []) {
        expect(
          pokesByName,
          `${pokemon.name} -> ${evolution.pokemon_name}`
        ).toHaveProperty([evolution.pokemon_name]);
      }
    }
  });
});
