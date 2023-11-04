import { useEffect, useReducer, useRef } from "react";
import useStickyState from "./useStickyState";
import useInterval from "./useInterval";
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

const initialState = {
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
    unlockedAreas: ["Home", "Area 1"],
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
};

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

const gameReducer = (state, action) => {
  switch (action.type) {
    case "START_BATTLE":
      return {
        ...state,
        battle: {
          ...state.battle,
          pokemon: action.payload.pokemon,
          isTrainer: action.payload.isTrainer || false,
          turn: 0,
        },
      };
    case "UPDATE_CURRENT_HEX":
      return {
        ...state,
        player: {
          ...state.player,
          currentHex: action.payload.newHex,
          isInTown: action.payload.newHex.isTown || false,
        },
      };
    case "UPDATE_PARTY":
      return {
        ...state,
        player: {
          ...state.player,
          party: action.payload.newParty,
        },
      };
    case "UPDATE_BANK":
      return {
        ...state,
        player: {
          ...state.player,
          bank: action.payload.newBank,
        },
      };
    case "UPDATE_POKEDEX":
      return {
        ...state,
        player: {
          ...state.player,
          pokedex: action.payload.newPokedex,
        },
      };
    case "UNLOCK_AREA":
      return {
        ...state,
        player: {
          ...state.player,
          unlockedAreas: [...state.player.unlockedAreas, action.payload.area],
        },
      };
    case "UPDATE_ITEMS":
      return {
        ...state,
        player: {
          ...state.player,
          items: action.payload.newItems,
        },
      };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: {
          ...state.events,
          [action.payload.event]: action.payload.value,
        },
      };
    case "UPDATE_BATTLE":
      return {
        ...state,
        battle: {
          ...state.battle,
          ...action.payload,
        },
      };
    case "UPDATE_PLAYER":
      return {
        ...state,
        player: {
          ...state.player,
          ...action.payload,
        },
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const useGameSession = () => {
  const [savedState, setSavedState] = useStickyState(initialState, "game");
  const [state, dispatch] = useReducer(gameReducer, savedState);

  const debounceSave = useRef();

  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

  useEffect(() => {
    clearTimeout(debounceSave.current);
    debounceSave.current = setTimeout(() => {
      setSavedState(state);
    }, 10000);
  }, [state, setSavedState]);

  const startBattle = (pokemon) => {
    dispatch({ type: "START_BATTLE", payload: { pokemon } });
  };

  const attemptCatch = (pokemon) => {
    const { player } = state;
    const { party, items } = player;
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
        updateParty(newParty);
        updatePokedex({
          ...player.pokedex,
          seen: new Set([...player.pokedex.seen, pokemon.id]),
          caught: new Set([...player.pokedex.caught, pokemon.id]),
        });
      } else {
        const newBank = [...player.bank, pokemon];
        updateBank(newBank);
        updatePokedex({
          ...player.pokedex,
          seen: new Set([...player.pokedex.seen, pokemon.id]),
          caught: new Set([...player.pokedex.caught, pokemon.id]),
        });
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
      updateItems(newItems);
    } else {
      const newItems = items.map((item) => {
        if (item.name === "Pokeball") {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      updateItems(newItems);
      updatePokedex({
        ...player.pokedex,
        seen: new Set([...player.pokedex.seen, pokemon.id]),
      });
    }
  };

  const updateCurrentHex = (newHex) => {
    const hex = getHexDetails(newHex.q, newHex.r, newHex.s);

    if (hex.isTown) {
      updateBattle({ pokemon: null });
      updatePlayer({
        party: state.player.party.map((poke) => ({
          ...poke,
          currentHP: poke.maxHP,
        })),
      });
    } else {
      updateBattle({ pokemon: getWildPokemon(hex) });
    }
    dispatch({ type: "UPDATE_CURRENT_HEX", payload: { newHex } });
  };

  const updateParty = (newParty) => {
    dispatch({ type: "UPDATE_PARTY", payload: { newParty } });
  };

  const updateBank = (newBank) => {
    dispatch({ type: "UPDATE_BANK", payload: { newBank } });
  };

  const updateItems = (newItems) => {
    dispatch({ type: "UPDATE_ITEMS", payload: { newItems } });
  };

  const updatePokedex = (newPokedex) => {
    dispatch({ type: "UPDATE_POKEDEX", payload: { newPokedex } });
  };

  const unlockArea = (area) => {
    dispatch({ type: "UNLOCK_AREA", payload: { area } });
  };

  const updateEvent = (event, value) => {
    dispatch({ type: "UPDATE_EVENT", payload: { event, value } });
  };

  const updateBattle = (payload) => {
    dispatch({ type: "UPDATE_BATTLE", payload });
  };

  const updatePlayer = (payload) => {
    dispatch({ type: "UPDATE_PLAYER", payload });
  };

  const updateExperience = (pokemon) => {
    const newParty = state.player.party.map((poke) => {
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

      if (newLevel > poke.level) {
        const basePokemon = pokes.find((p) => p.id === poke.id);
        const newMaxHP = calcMaxHP(basePokemon.stats[0].base_stat, newLevel);
        const newAttack = calcStat(basePokemon.stats[1].base_stat, newLevel);
        const newDefense = calcStat(basePokemon.stats[2].base_stat, newLevel);
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

    updateParty(newParty);
  };

  const handleTurn = () => {
    const { battle, player } = state;
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
        updateCurrentHex(homeHex);
        return;
      } else {
        updateParty([
          party[newLeadPokemon],
          ...party.slice(0, newLeadPokemon),
          ...party.slice(newLeadPokemon + 1),
        ]);
      }
      return;
    }
    if (pokemon.currentHP === 0) {
      updateExperience(pokemon);
      if (player.catchingStatus === "ALL") {
        attemptCatch(pokemon);
        updateCurrentHex(player.currentHex);
        return;
      }
    }
    const playerPokemon = party[0];

    const enemyPokemon = pokemon;
    const dmgTaken = calcDamage(playerPokemon.level, 1, 1, 1, 1, 1);
    const damageDealt = calcDamage(enemyPokemon.level, 1, 1, 1, 1, 1);
    updateBattle({
      turn: state.battle.turn + 1,
      pokemon: {
        ...pokemon,
        currentHP: Math.max(pokemon.currentHP - dmgTaken, 0),
      },
    });
    updatePlayer({
      party: [
        {
          ...playerPokemon,
          currentHP: Math.max(playerPokemon.currentHP - damageDealt, 0),
        },
        ...party.slice(1),
      ],
    });
  };

  useInterval(() => {
    handleTurn();
  }, 1000);

  return {
    game: state,
    startBattle,
    player: state.player,
    updateCurrentHex,
    updateParty,
    updateBank,
    updatePokedex,
    unlockArea,
    updateEvent,
    updateBattle,
  };
};
