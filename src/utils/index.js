import locations from "../locations";
import pokes from "../pokes";

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

const getWildPokemon = (hex) => {
  const potentialPokemon = hex.pokemon;
  const randomPokemonId = potentialPokemon[random(0, potentialPokemon.length)];
  const randomPokemon = createPokemon(randomPokemonId, random(1, 5));
  return randomPokemon;
};

const calcDamage = (poke1, poke2, lvl, cbtPow, atkPow, cbtDef, stab, y) => {
  return (
    ((((2 * lvl) / 5 + 2) * atkPow * (cbtPow / cbtDef)) / 50 + 2) *
    stab *
    y *
    (random(85, 100) / 100)
  );
};

const calcMaxHP = (baseHP, level) => (level / 50) * baseHP + level + 10;

const calcStat = (baseStat, level) => (level / 50) * baseStat + 5;

const catchRate = (hp, maxHP, status, ball, level) => {
  const a = (3 * maxHP - 2 * hp) / (3 * maxHP);
  const b = Math.floor(Math.floor((a * ball) / 255) * status);
  const c = Math.max((36 - 2 * level) / 10, 1) * b;
  return c >= 255 ? 255 : c;
};

const catchChance = (hp, maxHP, status, ball, level) => {
  const rate = catchRate(hp, maxHP, status, ball, level);
  const chance = (rate / 255) * 100;
  return chance >= 100 ? 100 : chance;
};

const createPokemon = (id, level) => {
  const pokemon = pokes.find((poke) => poke.id === id);
  const hp = calcMaxHP(pokemon.stats[0].base_stat, level);
  const attack = calcStat(pokemon.stats[1].base_stat, level);
  const defense = calcStat(pokemon.stats[2].base_stat, level);
  const spAttack = calcStat(pokemon.stats[3].base_stat, level);
  const spDefense = calcStat(pokemon.stats[4].base_stat, level);
  const speed = calcStat(pokemon.stats[5].base_stat, level);
  const gender = Math.random() > pokemon.genderRate / 8 ? "male" : "female";
  const xp = Math.floor((4 * level ** 3) / 5);

  return {
    id,
    name: pokemon.name,
    image: pokemon.sprites.front_default,
    level,
    xp,
    maxHP: hp,
    currentHP: hp,
    attack,
    defense,
    spAttack,
    spDefense,
    speed,
    gender,
  };
};

export {
  axialDistance,
  calcDamage,
  calcMaxHP,
  calcStat,
  catchChance,
  createPokemon,
  getWildPokemon,
  random,
  getHexDetails,
};
