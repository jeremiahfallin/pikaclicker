import { useState, useEffect } from "react";

// Initialize player state.
const initialPlayerState = {
  currentHex: { q: 13, r: 2, s: 11 },
  party: [],
  bank: [],
  pokedex: {
    seen: [],
    caught: [],
  },
  unlockedAreas: ["Area 1"],
  events: {
    pickStarter: 0,
  },
  enemyPokemon: {
    id: 1,
    lvl: 100,
    xp: 0,
  },
};

export default function usePlayer() {
  // State to hold the player's data
  const [player, setPlayer] = useState(initialPlayerState);

  // Function to update the player's current location
  const updateCurrentHex = (newHex) => {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      currentHex: newHex,
    }));
  };

  // Function to update the player's party
  const updateParty = (newParty) => {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      party: newParty,
    }));
  };

  // Function to update the player's bank
  const updateBank = (newBank) => {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      bank: newBank,
    }));
  };

  // Function to update the player's Pokedex
  const updatePokedex = (newPokedex) => {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      pokedex: newPokedex,
    }));
  };

  // Other functions to manage the player's state could go here...

  // Effect to save the player state to local storage, API, etc., when it changes
  useEffect(() => {
    // Implement saving to local storage, or an API call to update the backend
  }, [player]);

  // Return the player state and functions to manipulate it
  return {
    player,
    updateCurrentHex,
    updateParty,
    updateBank,
    updatePokedex,
  };
}
