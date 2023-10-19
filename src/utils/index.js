import locations from "../locations";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const getPokemonSpawnByHex = (q, r, s) =>
  locations.find((hex) => hex.q === q && hex.r === r && hex.s === s).pokemon;

export { random, getPokemonSpawnByHex };
