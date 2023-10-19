import { useState } from "react";
import useStickyState from "./useStickyState";

const intitialState = {
  battle: {
    hp: 0,
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
        hp: pokemon.stats.hp,
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
