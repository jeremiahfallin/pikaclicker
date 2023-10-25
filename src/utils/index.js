import locations from "../locations";

const axialSubtract = (a, b) => {
  return { q: a.q - b.q, r: a.r - b.r };
};

const axialDistance = (a, b) => {
  const vec = axialSubtract(a, b);
  return (Math.abs(vec.q) + Math.abs(vec.q + vec.r) + Math.abs(vec.r)) / 2;
};

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const getHexDetails = (q, r, s) =>
  locations.find((hex) => hex.q === q && hex.r === r && hex.s === s);

const calcDamage = (lvl, cbtPow, atkPow, cbtDef, stab, y) =>
  ((((2 * lvl) / 5 + 2) * atkPow * (cbtPow / cbtDef)) / 50 + 2) *
  stab *
  y *
  (random(85, 100) / 100);

export { axialDistance, calcDamage, random, getHexDetails };
