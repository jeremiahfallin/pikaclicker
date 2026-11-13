import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import superjson from "superjson";
import areas from "@/areas";
import useGameStore, {
  loadSave,
  updateBadges,
  updatePokedex,
} from "@/hooks/useGameStore";
import {
  fixRandom,
  hexOnlyIn,
  pokemon,
  startGame,
  startWildBattle,
} from "@/test/helpers";
import { homeHex, mediumSlowGrowth } from "@/utils";

const state = () => useGameStore.getState();

beforeEach(() => {
  startGame();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadSave", () => {
  it.each([
    ["nothing", null],
    ["a string", "not a save"],
    ["an empty object", {}],
    ["a player without a party", { player: { coins: 5 } }],
  ])("rejects %s and leaves the game alone", (_, data) => {
    startGame({ player: { coins: 1234 } });
    expect(loadSave(data)).toBe(false);
    expect(state().player.coins).toBe(1234);
  });

  it("fills in anything an older save is missing", () => {
    expect(loadSave({ player: { party: [], coins: 50 } })).toBe(true);
    expect(state().player.coins).toBe(50);
    expect(state().player.items).toEqual([
      { name: "Pokeball", quantity: 10, type: "ball" },
    ]);
    expect(state().settings).toMatchObject({
      ball: "Pokeball",
      minimumIVPercent: 0,
    });
    expect(state().player.unlockedAreas).toEqual(new Set(["Home"]));
  });

  it("turns lists from JSON saves back into sets", () => {
    loadSave({
      player: {
        party: [],
        pokedex: { seen: [1, 4], caught: [1] },
        unlockedAreas: ["Home", "Area 1"],
        badges: ["Grass"],
      },
    });
    expect(state().player.pokedex.seen).toEqual(new Set([1, 4]));
    expect(state().player.pokedex.caught).toEqual(new Set([1]));
    expect(state().player.unlockedAreas).toEqual(new Set(["Home", "Area 1"]));
    expect(state().player.badges).toEqual(new Set(["Grass"]));
  });

  it("keeps the game's actions after loading", () => {
    loadSave({ player: { party: [] } });
    expect(typeof state().handleClick).toBe("function");
  });

  it("moves Pokémon in older saves off GitHub-hosted sprites", () => {
    const github = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
    loadSave({
      player: {
        party: [pokemon("bulbasaur", 5, { image: `${github}/1.png` })],
        bank: [
          pokemon("pikachu", 5, { image: `${github}/shiny/25.png`, isShiny: true }),
        ],
      },
      battle: { pokemon: [pokemon("weedle", 3, { image: `${github}/13.png` })] },
    });
    expect(state().player.party[0].image).toBe("/sprites/pokemon/1.png");
    expect(state().player.bank[0].image).toBe("/sprites/pokemon/shiny/25.png");
    expect(state().battle.pokemon[0].image).toBe("/sprites/pokemon/13.png");
  });

  it("round-trips a game through a cloud save", () => {
    startGame({
      player: {
        party: [pokemon("bulbasaur", 12)],
        bank: [pokemon("pikachu", 8)],
        coins: 4321,
        pokedex: { seen: [1, 25], caught: [1] },
        badges: ["Grass"],
      },
    });
    const cloudSave = superjson.stringify(state());

    startGame();
    expect(loadSave(superjson.parse(cloudSave))).toBe(true);

    expect(state().player.coins).toBe(4321);
    expect(state().player.party.map((p) => p.name)).toEqual(["bulbasaur"]);
    expect(state().player.bank.map((p) => p.name)).toEqual(["pikachu"]);
    expect(state().player.pokedex.seen).toEqual(new Set([1, 25]));
    expect(state().player.badges).toEqual(new Set(["Grass"]));
  });
});

describe("browser save", () => {
  it("saves the game to localStorage as it changes", () => {
    state().updateCoins(777);
    const saved = superjson.parse(localStorage.getItem("pokeclicker"));
    expect(saved.version).toBe(1);
    expect(saved.state.player.coins).toBe(777);
  });

  it("loads an old browser save and fills in what it is missing", async () => {
    localStorage.setItem(
      "pokeclicker",
      superjson.stringify({
        version: 0,
        state: {
          player: {
            party: [pokemon("bulbasaur", 7)],
            coins: 99,
            pokedex: { seen: [1], caught: [1] },
          },
        },
      })
    );

    await useGameStore.persist.rehydrate();

    expect(state().player.coins).toBe(99);
    expect(state().player.party[0].name).toBe("bulbasaur");
    expect(state().player.pokedex.caught).toEqual(new Set([1]));
    expect(state().settings.ball).toBe("Pokeball");
    expect(state().player.unlockedAreas).toEqual(new Set(["Home"]));
  });
});

describe("moving on the map", () => {
  it("won't enter a locked area", () => {
    state().updateCurrentHex(hexOnlyIn("Area 1"));
    expect(state().player.currentHex).toEqual(homeHex);
    expect(state().battle.pokemon).toBeNull();
  });

  it("starts a wild battle in an unlocked area", () => {
    startGame({ player: { unlockedAreas: ["Home", "Area 1"] } });
    const hex = hexOnlyIn("Area 1");
    const area1 = areas.find((a) => a.name === "Area 1");

    state().updateCurrentHex(hex);

    const [wild] = state().battle.pokemon;
    expect(area1.pokemon).toContain(wild.name);
    expect(state().player.isInTown).toBe(false);
    expect(state().player.currentHex).toEqual(hex);
    expect(state().player.pokedex.seen.has(wild.id)).toBe(true);
  });

  it("starts a wild battle, not a trainer one, when leaving a gym battle", () => {
    startGame({
      player: {
        party: [pokemon("bulbasaur", 20)],
        unlockedAreas: ["Home", "Area 1"],
      },
      battle: {
        pokemon: [pokemon("pikachu", 12)],
        isTrainer: true,
        isComplete: false,
      },
    });

    state().updateCurrentHex(hexOnlyIn("Area 1"));

    expect(state().battle.pokemon).toHaveLength(1);
    expect(state().battle.isTrainer).toBe(false);
  });

  it("heals the party and ends the battle in a town", () => {
    const hurt = pokemon("bulbasaur", 10, { currentHP: 1 });
    startWildBattle(pokemon("pikachu", 5), { party: [hurt] });

    state().updateCurrentHex(homeHex);

    expect(state().player.isInTown).toBe(true);
    expect(state().battle.pokemon).toBeNull();
    expect(state().player.party[0].currentHP).toBe(hurt.maxHP);
  });
});

describe("clicking in battle", () => {
  it("damages the wild Pokémon", () => {
    fixRandom(0.5);
    const enemy = pokemon("pikachu", 5);
    startWildBattle(enemy);

    state().handleClick();

    const hp = state().battle.pokemon[0].currentHP;
    expect(hp).toBeLessThan(enemy.maxHP);
    expect(hp).toBeGreaterThanOrEqual(0);
  });

  it("rewards the player for a knocked-out Pokémon and finds another", () => {
    fixRandom(0.9999); // the catch fails
    const enemy = pokemon("pikachu", 9, { currentHP: 0 });
    startWildBattle(enemy);
    const lead = state().player.party[0];

    state().handleClick();

    const expectedCoins = Math.floor(10 + 5 * Math.sqrt(9) * Math.log(9));
    expect(state().player.coins).toBe(1000 + expectedCoins);
    expect(state().player.party[0].xp).toBeGreaterThan(lead.xp);
    expect(state().player.party[0].pokemonKnockedOut).toBe(1);
    expect(state().player.party[0].happiness).toBe(1);
    expect(state().battle.pokemon[0].uuid).not.toBe(enemy.uuid);
  });

  it("gives a Gimmighoul Coin for knocking out Gimmighoul", () => {
    fixRandom(0.9999);
    startWildBattle(pokemon("gimmighoul", 9, { currentHP: 0 }));

    state().handleClick();

    const coins = state().player.items.find(
      (i) => i.slug === "gimmighoul-coins"
    );
    expect(coins.quantity).toBe(1);
  });
});

describe("catching", () => {
  it("adds a caught Pokémon to the party and uses a ball", () => {
    fixRandom(0); // the catch succeeds
    const wild = pokemon("pikachu", 5, { currentHP: 0 });
    startWildBattle(wild);

    state().attemptCatch(wild);

    expect(state().player.party.map((p) => p.uuid)).toContain(wild.uuid);
    expect(state().player.pokedex.caught.has(wild.id)).toBe(true);
    expect(state().player.items[0].quantity).toBe(9);
  });

  it("sends a caught Pokémon to the bank, healed, when the party is full", () => {
    fixRandom(0);
    const party = Array.from({ length: 6 }, (_, i) =>
      pokemon("bulbasaur", 10 + i)
    );
    const wild = pokemon("pikachu", 5, { currentHP: 0 });
    startWildBattle(wild, { party });

    state().attemptCatch(wild);

    expect(state().player.party).toHaveLength(6);
    expect(state().player.bank).toHaveLength(1);
    expect(state().player.bank[0].currentHP).toBe(wild.maxHP);
  });

  it("still uses a ball and marks the Pokémon seen when the catch fails", () => {
    fixRandom(0.9999);
    const wild = pokemon("bulbasaur", 30, { currentHP: 0 });
    startWildBattle(wild, { party: [pokemon("pikachu", 30)] });

    state().attemptCatch(wild);

    expect(state().player.party).toHaveLength(1);
    expect(state().player.pokedex.seen.has(wild.id)).toBe(true);
    expect(state().player.pokedex.caught.has(wild.id)).toBe(false);
    expect(state().player.items[0].quantity).toBe(9);
  });

  it("doesn't throw a ball when out of balls", () => {
    fixRandom(0);
    const wild = pokemon("pikachu", 5, { currentHP: 0 });
    startWildBattle(wild);
    state().updateItems([{ name: "Pokeball", quantity: 0, type: "ball" }]);

    state().attemptCatch(wild);

    expect(state().player.party).toHaveLength(1);
  });

  it("doesn't throw a ball at Pokémon the settings skip", () => {
    fixRandom(0);
    const wild = pokemon("bulbasaur", 5, { currentHP: 0 });
    startWildBattle(wild, { party: [pokemon("pikachu", 10)] });
    updatePokedex(wild.id, true);
    useGameStore.setState({
      settings: { ...state().settings, repeatPokemon: false },
    });

    state().attemptCatch(wild);

    expect(state().player.party).toHaveLength(1);
    expect(state().player.items[0].quantity).toBe(10);
  });
});

describe("battle turns", () => {
  it("lets the wild Pokémon attack on its turn", () => {
    fixRandom(0.5);
    startWildBattle(pokemon("pikachu", 5));
    const lead = state().player.party[0];

    state().handleTurn();

    expect(state().player.party[0].currentHP).toBeLessThan(lead.currentHP);
  });

  it("lets the player's Pokémon attack on its turn", () => {
    fixRandom(0.5);
    const enemy = pokemon("pikachu", 5);
    startWildBattle(enemy);

    state().handleTurn("player");

    expect(state().battle.pokemon[0].currentHP).toBeLessThan(enemy.maxHP);
    expect(state().battle.turn).toBe(1);
  });

  it("sends out the next healthy Pokémon when the lead faints", () => {
    const fainted = pokemon("bulbasaur", 10, { currentHP: 0 });
    const healthy = pokemon("pikachu", 10);
    startWildBattle(pokemon("pikachu", 5), { party: [fainted, healthy] });

    state().handleTurn();

    expect(state().player.party.map((p) => p.uuid)).toEqual([
      healthy.uuid,
      fainted.uuid,
    ]);
  });

  it("sends the player home, healed, when the whole party faints", () => {
    const fainted = pokemon("bulbasaur", 10, { currentHP: 0 });
    startWildBattle(pokemon("pikachu", 5), { party: [fainted] });

    state().handleTurn();

    expect(state().player.currentHex).toMatchObject({
      q: homeHex.q,
      r: homeHex.r,
    });
    expect(state().player.isInTown).toBe(true);
    expect(state().battle.pokemon).toBeNull();
    expect(state().player.party[0].currentHP).toBe(fainted.maxHP);
  });
});

describe("party and bank", () => {
  it("swaps a party Pokémon with a banked one in town", () => {
    const inParty = pokemon("bulbasaur", 10);
    const inBank = pokemon("pikachu", 10);
    startGame({ player: { party: [inParty], bank: [inBank] } });

    state().swapPokemon(inParty.uuid, "party", inBank.uuid, "bank");

    expect(state().player.party[0].uuid).toBe(inBank.uuid);
    expect(state().player.bank[0].uuid).toBe(inParty.uuid);
  });

  it.each([
    ["in the wild", { isInTown: false }, null],
    ["during a gym battle", { isInTown: true }, [pokemon("pikachu", 5)]],
  ])("won't swap %s", (_, player, battlePokemon) => {
    const inParty = pokemon("bulbasaur", 10);
    const inBank = pokemon("pikachu", 10);
    startGame({
      player: { party: [inParty], bank: [inBank], ...player },
      battle: { pokemon: battlePokemon },
    });

    state().swapPokemon(inParty.uuid, "party", inBank.uuid, "bank");

    expect(state().player.party[0].uuid).toBe(inParty.uuid);
  });

  it("changes Shaymin back to its Land Forme when banked", () => {
    const shaymin = pokemon("shaymin-sky", 30);
    const inBank = pokemon("pikachu", 10);
    startGame({ player: { party: [shaymin], bank: [inBank] } });

    state().swapPokemon(shaymin.uuid, "party", inBank.uuid, "bank");

    expect(state().player.bank[0]).toMatchObject({
      name: "shaymin-land",
      uuid: shaymin.uuid,
    });
  });

  it("gives the party experience for a released Pokémon", () => {
    const lead = pokemon("bulbasaur", 10);
    const released = pokemon("pikachu", 10);
    startGame({ player: { party: [lead], bank: [released] } });

    state().releasePokemon(released.uuid);

    expect(state().player.bank).toEqual([]);
    expect(state().player.party[0].xp).toBeGreaterThan(lead.xp);
  });
});

describe("levelling up", () => {
  it("evolves a Pokémon that reaches its evolution level", () => {
    const bulbasaur = pokemon("bulbasaur", 15, { xp: mediumSlowGrowth(16) - 1 });
    startGame({ player: { party: [bulbasaur] } });

    state().updateExperience(pokemon("pikachu", 10));

    expect(state().player.party[0]).toMatchObject({
      name: "ivysaur",
      level: 16,
      uuid: bulbasaur.uuid,
    });
    expect(state().player.pokedex.caught.has(2)).toBe(true);
  });

  it("only gains experience when short of the next level", () => {
    const bulbasaur = pokemon("bulbasaur", 15);
    startGame({ player: { party: [bulbasaur] } });

    state().updateExperience(pokemon("pikachu", 2));

    expect(state().player.party[0]).toMatchObject({
      name: "bulbasaur",
      level: 15,
    });
    expect(state().player.party[0].xp).toBeGreaterThan(bulbasaur.xp);
  });
});

describe("evolution items", () => {
  const waterStone = (quantity) => ({
    name: "Water Stone",
    slug: "water-stone",
    type: "evolution-item",
    quantity,
  });
  const gimmighoulCoins = (quantity) => ({
    name: "Gimmighoul Coins",
    slug: "gimmighoul-coins",
    type: "evolution-item",
    quantity,
  });

  it("evolves a Pokémon and uses up the item", () => {
    const eevee = pokemon("eevee", 20);
    startGame({ player: { party: [eevee], items: [waterStone(2)] } });

    state().applyItemOnPokemon(waterStone(2), eevee.uuid, "party");

    expect(state().player.party[0]).toMatchObject({
      name: "vaporeon",
      uuid: eevee.uuid,
    });
    expect(state().player.items).toEqual([waterStone(1)]);
  });

  it("removes the item when the last one is used", () => {
    const eevee = pokemon("eevee", 20);
    startGame({ player: { bank: [eevee], items: [waterStone(1)] } });

    state().applyItemOnPokemon(waterStone(1), eevee.uuid, "bank");

    expect(state().player.bank[0].name).toBe("vaporeon");
    expect(state().player.items).toEqual([]);
  });

  it("needs 999 Gimmighoul Coins to evolve Gimmighoul", () => {
    const gimmighoul = pokemon("gimmighoul", 20);
    startGame({ player: { party: [gimmighoul], items: [gimmighoulCoins(998)] } });

    state().applyItemOnPokemon(gimmighoulCoins(998), gimmighoul.uuid, "party");
    expect(state().player.party[0].name).toBe("gimmighoul");

    state().updateItems([gimmighoulCoins(999)]);
    state().applyItemOnPokemon(gimmighoulCoins(999), gimmighoul.uuid, "party");
    expect(state().player.party[0].name).toBe("gholdengo");
    expect(state().player.items).toEqual([]);
  });
});

describe("badges", () => {
  it("unlocks the next areas for a badge", () => {
    updateBadges("Grass");

    expect(state().player.badges.has("Grass")).toBe(true);
    expect(state().player.unlockedAreas).toEqual(
      new Set(["Home", "Area 2", "Volcano Town"])
    );
  });
});
