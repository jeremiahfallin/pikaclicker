import areas from "../areas";
import locations from "../locations";
import pokes from "../pokes";

const homeHex = { q: 13, r: 2, s: 11 };

const axialSubtract = (a, b) => {
  return { q: a.q - b.q, r: a.r - b.r };
};

const axialDistance = (a, b) => {
  const vec = axialSubtract(a, b);
  return (Math.abs(vec.q) + Math.abs(vec.q + vec.r) + Math.abs(vec.r)) / 2;
};

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getHexDetails = (q, r, s) => {
  let spawnablePokemon = new Set();
  let isTown = false;
  for (let area of areas) {
    if (
      area.hexes.findIndex(
        (hex) => hex.q === q && hex.r === r && hex.s === s
      ) !== -1
    ) {
      area.pokemon.forEach((p) => spawnablePokemon.add(p));
      if (area.isTown) {
        isTown = true;
      }
    }
  }
  return {
    q,
    r,
    s,
    pokemon: [...spawnablePokemon],
    isTown: isTown,
  };
};

const getWildPokemon = (hex, areaIndex) => {
  const potentialPokemon = hex.pokemon;
  const randomPokemonId = determineSpawn(potentialPokemon);
  const baseLevel = axialDistance(homeHex, hex) + areaIndex * 10;
  const randomLevel = random(
    Math.max(1, Math.ceil(baseLevel * 0.9 - 2)),
    Math.min(100, Math.floor(baseLevel * 1.1 + 2))
  );
  const randomPokemon = createPokemon(randomPokemonId, randomLevel);
  return randomPokemon;
};

const calcDamage = (lvl, cbtPow, atkPow, cbtDef, stab, y) => {
  return (
    ((((2 * lvl) / 5 + 2) * atkPow * (cbtPow / cbtDef)) / 50 + 2) *
    stab *
    y *
    (random(85, 100) / 100)
  );
};

const calcMaxHP = (baseHP, level) => (level / 50) * baseHP + level + 10;

const calcStat = (baseStat, level) => (level / 50) * baseStat + 5;

const catchRate = (captureRate, hp, maxHP, status, ball, level) => {
  const a = (captureRate * (3 * maxHP - 2 * hp)) / (3 * maxHP);
  const b = a * ball * status;
  const c = Math.floor(Math.max((36 - 2 * level) / 10, 1) * b);
  return c >= 255 ? 255 : c;
};

const catchChance = (captureRate, hp, maxHP, status, ball, level) => {
  const rate = catchRate(captureRate, hp, maxHP, status, ball, level);
  const chance = (rate / 255) * 100;
  return chance >= 100 ? 100 : chance;
};

const createPokemon = (id, level) => {
  const pokemon = pokes.find((poke) => poke.id === id);
  const growthRate = pokemon.growthRate;
  const hp = calcMaxHP(pokemon.stats[0].base_stat, level);
  const attack = calcStat(pokemon.stats[1].base_stat, level);
  const defense = calcStat(pokemon.stats[2].base_stat, level);
  const spAttack = calcStat(pokemon.stats[3].base_stat, level);
  const spDefense = calcStat(pokemon.stats[4].base_stat, level);
  const speed = calcStat(pokemon.stats[5].base_stat, level);
  const gender = Math.random() > pokemon.genderRate / 8 ? "male" : "female";
  let xp;
  switch (growthRate) {
    case "fast":
      xp = fastGrowth(level);
      break;
    case "medium-fast":
      xp = mediumFastGrowth(level);
      break;
    case "medium-slow":
      xp = mediumSlowGrowth(level);
      break;
    case "slow":
      xp = slowGrowth(level);
      break;
    case "fluctuating":
      xp = fluctuatingGrowth(level);
      break;
    case "erratic":
      xp = erraticGrowth(level);
      break;
    default:
      xp = mediumFastGrowth(level);
  }

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
    captureRate: pokemon.captureRate,
    baseExperience: pokemon.baseExperience,
    growthRate: pokemon.growthRate,
  };
};

const erraticGrowth = (level) => {
  if (level <= 50) {
    return (level ** 3 * (100 - level)) / 50;
  } else if (level <= 68) {
    return (level ** 3 * (150 - level)) / 100;
  } else if (level <= 98) {
    return (level ** 3 * Math.floor(1.274 - level / 50)) / 1;
  } else {
    return (level ** 3 * (160 - level)) / 100;
  }
};

const fastGrowth = (level) => {
  return (level ** 3 * 4) / 5;
};

const mediumFastGrowth = (level) => {
  return level ** 3;
};

const mediumSlowGrowth = (level) => {
  return (6 / 5) * level ** 3 - 15 * level ** 2 + 100 * level - 140;
};

const slowGrowth = (level) => {
  return (5 / 4) * level ** 3;
};

const fluctuatingGrowth = (level) => {
  if (level <= 15) {
    return level ** 3 * ((level + 1) / 3 + 24 / 50);
  } else if (level <= 36) {
    return level ** 3 * ((level + 14) / 50);
  } else {
    return level ** 3 * (level / 2 + 32 / 50);
  }
};

const experienceGain = (base, levelEnemy, levelTrainer) => {
  let xp = (base * levelEnemy) / 5;
  xp *= ((levelEnemy * 2 + 10) / (levelEnemy + levelTrainer + 10)) ** 2.5;
  return xp;
};

function getTotalRarity(pokemonList) {
  return pokemonList.reduce(
    (total, pokemon) => total + pokes.find((p) => p.id === pokemon).rarity,
    0
  );
}

function determineSpawn(pokemonList) {
  const totalRarity = getTotalRarity(pokemonList);
  let randomNum = Math.floor(Math.random() * totalRarity) + 1;

  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    randomNum -= pokes.find((p) => p.id === pokemon).rarity;

    if (randomNum <= 0) {
      return pokemon;
    }
  }
}

export {
  axialDistance,
  calcDamage,
  calcMaxHP,
  calcStat,
  catchChance,
  createPokemon,
  experienceGain,
  getWildPokemon,
  random,
  getHexDetails,
  homeHex,
  fastGrowth,
  slowGrowth,
  erraticGrowth,
  mediumFastGrowth,
  mediumSlowGrowth,
  fluctuatingGrowth,
  determineSpawn,
};
