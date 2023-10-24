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

export const useGameSession = () => {
  const [state, setState] = useStickyState(intitialState, "game");

  const startBattle = (pokemon) => {
    console.log(pokemon);
    setState((prevState) => ({
      ...prevState,
      battle: {
        ...prevState.battle,
        opponentHealth: pokemon?.stats[0]?.base_stat,
        opponentPokemon: pokemon,
      },
    }));
  };

  // Function to update the player's current location
  const updateCurrentHex = (newHex) => {
    setState((prevState) => ({
      ...prevState,
      player: {
        ...prevState.player,
        currentHex: newHex,
      },
      isInTown: newHex.isTown || false,
    }));
  };

  // Function to update the player's party
  const updateParty = (newParty) => {
    setState((prevState) => ({
      ...prevState,
      player: {
        ...prevState.player,
        party: newParty,
      },
    }));
  };

  // Function to update the player's bank
  const updateBank = (newBank) => {
    setState((prevState) => ({
      ...prevState,
      player: {
        ...prevState.player,
        bank: newBank,
      },
    }));
  };

  // Function to update the player's Pokedex
  const updatePokedex = (newPokedex) => {
    setState((prevState) => ({
      ...prevState,
      player: {
        ...prevState.player,
        pokedex: newPokedex,
      },
    }));
  };

  const handleTurn = (state) => {
    const myPokemon = state.player.party[0];
    const myPokemonDetails = pokes.find((poke) => poke.id === myPokemon.id);

    if (state.isInTown) {
      setState((prevState) => ({
        ...prevState,
        player: {
          ...prevState.player,
          party: [
            {
              ...prevState.player.party[0],
              health: myPokemonDetails.stats[0].base_stat,
            },
            ...prevState.player.party.splice(1),
          ],
        },
      }));
    } else {
      const opponentPokemon = state.battle.opponentPokemon;

      const dmgDealt = calcDamage(
        myPokemon.lvl,
        Math.max(
          myPokemonDetails.stats[1].base_stat,
          myPokemonDetails.stats[3].base_stat
        ),
        80,
        Math.max(
          opponentPokemon.stats[2].base_stat,
          opponentPokemon.stats[4].base_stat
        ),
        1,
        1
      );
      const dmgTaken = calcDamage(
        5,
        Math.max(
          opponentPokemon.stats[1].base_stat,
          opponentPokemon.stats[3].base_stat
        ),
        80,
        Math.max(
          myPokemonDetails.stats[2].base_stat,
          myPokemonDetails.stats[4].base_stat
        ),
        1,
        1
      );
      setState((prevState) => ({
        ...prevState,
        player: {
          ...prevState.player,
          party: [
            {
              ...prevState.player.party[0],
              health: Math.max(prevState.player.party[0].health - dmgTaken, 0),
            },
            ...prevState.player.party.splice(1),
          ],
        },
        battle: {
          ...prevState.battle,
          opponentHealth: Math.max(
            prevState.battle.opponentHealth - dmgDealt,
            0
          ),
        },
      }));
    }
  };

  useInterval(() => {
    handleTurn(state);
  }, 1000);

  return {
    game: state,
    startBattle,
    player: state.player,
    updateCurrentHex,
    updateParty,
    updateBank,
    updatePokedex,
  };
};
