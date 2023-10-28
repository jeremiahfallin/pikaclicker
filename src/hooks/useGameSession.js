import { useEffect, useReducer, useRef } from "react";
import useStickyState from "./useStickyState";
import useInterval from "./useInterval";
import {
  axialDistance,
  calcDamage,
  calcMaxHP,
  calcStat,
  catchChance,
  getHexDetails,
  getWildPokemon,
  random,
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
    pokedex: {
      seen: new Set(),
      caught: new Set(),
    },
    unlockedAreas: ["Area 1"],
    isInTown: true,
  },
  events: {
    pickStarter: 0,
  },
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

  const updateCurrentHex = (newHex) => {
    const hex = getHexDetails(newHex.q, newHex.r, newHex.s);
    console.log(hex);
    if (hex.isTown) {
      updateBattle({ pokemon: null });
      updatePlayer({
        party: [
          {
            ...state.player.party[0],
            currentHP: state.player.party[0].maxHP,
          },
          ...state.player.party.slice(1),
        ],
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

  useInterval(() => {
    const { battle, player } = state;
    const { pokemon } = battle;
    const { party } = player;
    if (!pokemon) {
      return;
    }
    const playerPokemon = party[0];
    const enemyPokemon = pokemon;
    const dmgTaken = calcDamage(
      playerPokemon,
      enemyPokemon,
      playerPokemon.level,
      1,
      1,
      1,
      1,
      1
    );
    const damageDealt = calcDamage(
      enemyPokemon,
      playerPokemon,
      enemyPokemon.level,
      1,
      1,
      1,
      1,
      1
    );

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
  }, 1000);

  //   const forestPokemon = new Set();
  //   const hexes = areas[1].hexes;
  //   for (let hex of hexes) {
  //     console.log(hex);
  //     const hexDetails = getHexDetails(hex.q, hex.r, hex.s);
  //     forestPokemon.add(...hexDetails.pokemon);
  //   }

  //   console.log([...forestPokemon].sort((a, b) => parseInt(a) - parseInt(b)));

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
