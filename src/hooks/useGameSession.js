import useStickyState from "./useStickyState";
import useInterval from "./useInterval";
import { calcDamage } from "@/utils";
import pokes from "../pokes";

const intitialState = {
  battle: {
    opponentHealth: 0,
    opponentPokemon: null,
    isTrainer: false,
    turn: 0,
  },
  player: {
    currentHex: { q: 13, r: 2, s: 11 },
    party: [],
    bank: [],
    pokedex: {
      seen: [],
      caught: [],
    },
    unlockedAreas: ["Area 1"],
  },
  isInTown: true,
  events: {
    pickStarter: 0,
  },
};
