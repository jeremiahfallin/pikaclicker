import { create } from "zustand";
import { persist } from "zustand/middleware";
import superjson from "superjson";
import {
  axialDistance,
  calcDamage,
  calcMaxHP,
  calcStat,
  catchChance,
  experienceGain,
  getHexDetails,
  getWildPokemon,
  random,
  homeHex,
  fastGrowth,
  slowGrowth,
  erraticGrowth,
  mediumFastGrowth,
  mediumSlowGrowth,
  fluctuatingGrowth,
} from "@/utils";
import pokes from "../pokes";
import areas from "../areas";
import locations from "../locations";

const pokeballChances = {
  Pokeball: 1,
  Greatball: 1.5,
  Ultraball: 2,
  Masterball: 255,
  Diveball: 3.5,
};

const levelFormulas = {
  erratic: erraticGrowth,
  fast: fastGrowth,
  "medium-fast": mediumFastGrowth,
  medium: mediumFastGrowth,
  "medium-slow": mediumSlowGrowth,
  slow: slowGrowth,
  fluctuating: fluctuatingGrowth,
};

const storage = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return superjson.parse(str);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

const useGameStore = create(
  persist(
    (set, get) => ({
      battle: {
        pokemon: null,
        isTrainer: false,
        turn: 0,
      },
      player: {
        currentHex: { q: 13, r: 2, s: 11 },
        party: [],
        bank: [],
        coins: 1000,
        pokedex: {
          seen: new Set(),
          caught: new Set(),
        },
        unlockedAreas: new Set(["Home"]),
        isInTown: true,
        items: [
          {
            name: "Pokeball",
            quantity: 10,
          },
        ],
        catchingStatus: "ALL",
      },
      events: {
        pickStarter: 0,
      },
      settings: {
        newPokemon: true,
        repeatPokemon: true,
        shinyPokemon: true,
        minimumIVPercent: 0,
      },
      attemptCatch: (pokemon) => {
        const player = get().player;
        const party = get().player.party;
        const items = get().player.items;
        const pokeball = items.find((item) => item.name === "Pokeball");
        if (pokeball.quantity <= 0) {
          return;
        }
        const pokeballChance = pokeballChances[pokeball.name];
        const captureRate = pokemon.captureRate;
        const chance = catchChance(
          captureRate,
          pokemon.currentHP,
          pokemon.maxHP,
          1,
          pokeballChance,
          pokemon.level
        );
        const randomNum = random(0, 100);

        if (randomNum <= chance) {
          if (party.length < 6) {
            const newParty = [...party, pokemon];
            set((state) => ({
              ...state,
              player: {
                ...state.player,
                party: newParty,
              },
            }));
          } else {
            const newBank = [...player.bank, pokemon];
            set((state) => ({
              ...state,
              player: {
                ...state.player,
                bank: newBank,
              },
            }));
          }
          set((state) => ({
            ...state,
            player: {
              ...state.player,
              pokedex: {
                seen: new Set([...state.player.pokedex.seen, pokemon.id]),
                caught: new Set([...state.player.pokedex.caught, pokemon.id]),
              },
            },
          }));
        } else {
          set((state) => ({
            ...state,
            player: {
              ...state.player,
              pokedex: {
                seen: new Set([...state.player.pokedex.seen, pokemon.id]),
                caught: state.player.pokedex.caught,
              },
            },
          }));
        }
        const newItems = items.map((item) => {
          if (item.name === "Pokeball") {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
        set((state) => ({
          ...state,
          player: {
            ...state.player,
            items: newItems,
          },
        }));
      },
      updateCurrentHex: (newHex) => {
        const unlockedAreas = get().player.unlockedAreas;

        const hex = getHexDetails(newHex.q, newHex.r, newHex.s);
        let hexArea =
          areas.find((area) =>
            area.hexes.some(
              (h) => h.q === hex.q && h.r === hex.r && h.s === hex.s
            )
          )?.name || "";

        if (!unlockedAreas.has(hexArea)) {
          return;
        }

        if (hex.isTown) {
          set((state) => ({
            ...state,
            battle: {
              ...state.battle,
              pokemon: null,
            },
            player: {
              ...state.player,
              isInTown: true,
              currentHex: homeHex,
              party: state.player.party.map((poke) => ({
                ...poke,
                currentHP: poke.maxHP,
              })),
            },
          }));
        } else {
          const areaIndex = areas.findIndex(
            (area) =>
              area.hexes.findIndex(
                (h) => h.q === newHex.q && h.r === newHex.r && h.s === newHex.s
              ) !== -1
          );
          set((state) => ({
            ...state,
            battle: {
              ...state.battle,
              pokemon: getWildPokemon(hex, areaIndex - 1),
            },
            player: {
              ...state.player,
              isInTown: false,
              currentHex: newHex,
            },
          }));
        }
      },
      updateParty: (newParty) => {
        set((state) => ({
          ...state,
          player: {
            ...state.player,
            party: newParty,
          },
        }));
      },
      updateBank: (newBank) => {
        set((state) => ({
          ...state,
          player: {
            ...state.player,
            bank: newBank,
          },
        }));
      },
      updateCoins: (newCoins) => {
        set((state) => ({
          ...state,
          player: {
            ...state.player,
            coins: newCoins,
          },
        }));
      },
      updateItems: (newItems) => {
        set((state) => ({
          ...state,
          player: {
            ...state.player,
            items: newItems,
          },
        }));
      },
      updatePokedex: (newPokedex) => {
        set((state) => ({
          ...state,
          player: {
            ...state.player,
            pokedex: newPokedex,
          },
        }));
      },
      updateEvent: (event, value) => {
        set((state) => ({
          ...state,
          events: {
            ...state.events,
            [event]: value,
          },
        }));
      },
      updateBattle: (payload) => {
        set((state) => ({
          ...state,
          battle: {
            ...state.battle,
            ...payload,
          },
        }));
      },
      updatePlayer: (payload) => {
        set((state) => ({
          ...state,
          player: {
            ...state.player,
            ...payload,
          },
        }));
      },
      swapPokemon: (idx1, place1, idx2, place2) => {
        // swaps pokemon, may swap between just party, just bank, or party and bank
        const isInTown = get().player.isInTown;
        const party = get().player.party;
        const bank = get().player.bank;
        if (isInTown) {
          if (place1 === "party" && place2 === "party") {
            const newParty = [...party];
            const temp = newParty[idx1];
            newParty[idx1] = newParty[idx2];
            newParty[idx2] = temp;
            get().updateParty(newParty);
          } else if (place1 === "bank" && place2 === "bank") {
            const newBank = [...bank];
            const temp = newBank[idx1];
            newBank[idx1] = newBank[idx2];
            newBank[idx2] = temp;
            get().updateBank(newBank);
          } else if (place1 === "party" && place2 === "bank") {
            const newParty = [...party];
            const newBank = [...bank];
            const temp = newParty[idx1];
            newParty[idx1] = newBank[idx2];
            newBank[idx2] = temp;
            get().updateParty(newParty);
            get().updateBank(newBank);
          } else if (place1 === "bank" && place2 === "party") {
            const newParty = [...party];
            const newBank = [...bank];
            const temp = newBank[idx1];
            newBank[idx1] = newParty[idx2];
            newParty[idx2] = temp;
            get().updateParty(newParty);
            get().updateBank(newBank);
          }
        }
      },
      releasePokemon: (idx) => {
        const player = get().player;
        const bank = player.bank;
        const newBank = [...bank];
        const releasedPokemon = newBank[idx];
        newBank.splice(idx, 1);
        get().updateBank(newBank);
        get().updateExperience(releasedPokemon);
      },
      updateExperience: (pokemon) => {
        const newParty = get().player.party.map((poke) => {
          const newExperience =
            poke.xp +
            experienceGain(pokemon.baseExperience, pokemon.level, poke.level);
          const nextLevelExperience = levelFormulas[poke.growthRate](
            poke.level + 1
          );
          let newLevel = poke.level;
          if (newExperience >= nextLevelExperience) {
            newLevel = poke.level + 1;
          }
          if (newLevel > 16) {
            unlockArea("Area 2");
          }

          if (newLevel > poke.level) {
            const basePokemon = pokes.find((p) => p.id === poke.id);
            const newMaxHP = calcMaxHP(
              basePokemon.stats[0].base_stat,
              newLevel
            );
            const newAttack = calcStat(
              basePokemon.stats[1].base_stat,
              newLevel
            );
            const newDefense = calcStat(
              basePokemon.stats[2].base_stat,
              newLevel
            );
            const newSpecialAttack = calcStat(
              basePokemon.stats[3].base_stat,
              newLevel
            );
            const newSpecialDefense = calcStat(
              basePokemon.stats[4].base_stat,
              newLevel
            );
            const newSpeed = calcStat(basePokemon.stats[5].base_stat, newLevel);
            return {
              ...poke,
              level: newLevel,
              maxHP: newMaxHP,
              currentHP: newMaxHP,
              attack: newAttack,
              defense: newDefense,
              specialAttack: newSpecialAttack,
              specialDefense: newSpecialDefense,

              speed: newSpeed,
            };
          } else {
            return {
              ...poke,
              xp: newExperience,
            };
          }
        });
        get().updateParty(newParty);
      },
      handleTurn: () => {
        const { battle, player } = get();
        const { pokemon } = battle;
        const { party } = player;

        if (!pokemon) {
          return;
        }
        if (party[0].currentHP === 0) {
          const newLeadPokemon = party.findIndex((poke) => {
            return poke.currentHP > 0;
          });
          if (newLeadPokemon === -1) {
            get().updateCurrentHex(homeHex);
            return;
          } else {
            get().updateParty([
              party[newLeadPokemon],
              ...party.slice(0, newLeadPokemon),
              ...party.slice(newLeadPokemon + 1),
            ]);
          }
          return;
        }
        if (pokemon.currentHP === 0) {
          get().updateCoins(player.coins + pokemon.level * 10);
          get().updateExperience(pokemon);
          if (player.catchingStatus === "ALL") {
            get().attemptCatch(pokemon);
            get().updateCurrentHex(player.currentHex);
            return;
          }
        }
        const playerPokemon = party[0];

        const enemyPokemon = pokemon;
        const dmgTaken = calcDamage(enemyPokemon.level, 1, 1, 1, 1, 1);
        const dmgDealt = calcDamage(playerPokemon.level, 1, 1, 1, 1, 1);
        const newPlayerHP = Math.max(playerPokemon.currentHP - dmgTaken, 0);
        get().updateBattle({
          turn: get().battle.turn + 1,
          pokemon: {
            ...pokemon,
            currentHP: Math.max(pokemon.currentHP - dmgDealt, 0),
          },
        });
        get().updatePlayer({
          party: [
            {
              ...playerPokemon,
              currentHP:
                newPlayerHP > 0
                  ? Math.min(playerPokemon.maxHP, newPlayerHP)
                  : 0,
            },
            ...party.slice(1),
          ],
        });
      },
    }),
    {
      name: "pokeclicker",
      storage,
    }
  )
);

function updatePokedex(id, isCaught) {
  useGameStore.setState((state) => ({
    ...state,
    player: {
      ...state.player,
      pokedex: {
        ...state.player.pokedex,
        seen: new Set([...state.player.pokedex.seen, id]),
        caught: isCaught
          ? new Set([...state.player.pokedex.caught, id])
          : state.player.pokedex.caught,
      },
    },
  }));
}

function unlockArea(area) {
  useGameStore.setState((state) => ({
    ...state,
    player: {
      ...state.player,
      unlockedAreas: new Set([...state.player.unlockedAreas, area]),
    },
  }));
}
export { unlockArea, updatePokedex };
export default useGameStore;