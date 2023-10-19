import locations from "../locations";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const getPokemonSpawnByHex = (q, r, s) =>
  locations.find((hex) => hex.q === q && hex.r === r && hex.s === s).pokemon;

const calcDamage = (lvl, cbtPow, atkPow, cbtDef, stab, y) =>
  ((((2 * lvl) / 5 + 2) * atkPow * (cbtPow / cbtDef)) / 50 + 2) *
  stab *
  y *
  (random(85, 100) / 100);

export { calcDamage, random, getPokemonSpawnByHex };
