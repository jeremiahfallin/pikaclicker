import short from "short-uuid";
import areas from "../areas";
import pokes from "../pokes";

const homeHex = { q: 13, r: 2, s: 11 };
const legendaryNames = [
  "lugia",
  "ho-oh",
  "kyogre",
  "groudon",
  "chi-yu",
  "walking-wake",
  "deoxys-normal",
  "deoxys-attack",
  "deoxys-defense",
  "deoxys-speed",
  "rayquaza",
  "jirachi",
  "darkrai",
  "shaymin-land",
  "shaymin-sky",
  "arceus",
  "victini",
  "miraidon",
  "koraidon",
  "chi-yu",
  "articuno",
  "articuno-galar",
  "zapdos",
  "zapdos-galar",
  "moltres",
  "moltres-galar",
  "darkrai",
  "latios",
  "latias",
  "mew",
  "mewtwo",
  "suicune",
  "entei",
  "raikou",
  "celebi",
  "kartana",
  "guzzlord",
  "marshadow",
  "type-null",
  "ogerpon",
  "zacian",
  "zamazenta",
  "yveltal",
  "xerneas",
];

/**
 * Subtracts one axial coordinate from another.
 * @param {Object} a - The first axial coordinate.
 * @param {Object} b - The second axial coordinate.
 * @returns {Object} The result of the subtraction.
 */
const axialSubtract = (a, b) => {
  return { q: a.q - b.q, r: a.r - b.r };
};

/**
 * Calculates the axial distance between two hexes.
 * @param {Object} a - The first hex coordinate.
 * @param {Object} b - The second hex coordinate.
 * @returns {number} The axial distance between the two hexes.
 */
const axialDistance = (a, b) => {
  const vec = axialSubtract(a, b);
  return (Math.abs(vec.q) + Math.abs(vec.q + vec.r) + Math.abs(vec.r)) / 2;
};

/**
 * Generates a random integer within a specified range.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} A random integer between min and max.
 */
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * Retrieves details of a hex based on its coordinates.
 * @param {number} q - The q coordinate of the hex.
 * @param {number} r - The r coordinate of the hex.
 * @param {number} s - The s coordinate of the hex.
 * @returns {Object} An object containing details about the hex.
 */
const getHexDetails = (q, r) => {
  let spawnablePokemon = new Set();
  let isTown = false;
  let name = "";
  let minLevel = 1;
  let maxLevel = 10;
  for (let area of areas) {
    if (area.hexes.findIndex((hex) => hex.q === q && hex.r === r) !== -1) {
      area.pokemon.forEach((p) => spawnablePokemon.add(p));
      if (area.isTown) {
        isTown = true;
      }
      name = area.name;
      minLevel = area.minLevel;
      maxLevel = area.maxLevel;
    }
  }
  return {
    q,
    r,
    pokemon: [...spawnablePokemon],
    isTown: isTown,
    name,
    minLevel,
    maxLevel,
  };
};

/**
 * Creates a new wild Pokémon based on the current hex and area index.
 * @param {Object} hex - The current hex of the player.
 * @param {number} areaIndex - The index of the area.
 * @returns {Object} A new wild Pokémon object.
 */
const getWildPokemon = (hex) => {
  const potentialPokemon = hex.pokemon;
  const randomPokemonName = determineSpawn(potentialPokemon);
  const randomLevel = random(hex.minLevel, hex.maxLevel);
  let level = legendaryNames.includes(randomPokemonName) ? 70 : randomLevel;
  const randomPokemon = createPokemon(randomPokemonName, level);
  return randomPokemon;
};

/**
 * Calculates the damage dealt in a battle encounter.
 * @param {number} lvl - The level of the attacking Pokémon.
 * @param {number} cbtPow - Attack or special attack of the attacking pokemon, whichever is higher.
 * @param {number} atkPow - The power of the move used.
 * @param {number} cbtDef - The corresponding defense stat of the defending pokemon.
 * @param {number} stab - The Same Type Attack Bonus.
 * @param {number} y - Additional multipliers (e.g., weather, critical, random).
 * @returns {number} The calculated damage.
 */
const calcDamage = (lvl, cbtPow, atkPow, cbtDef, stab, y) => {
  return (
    ((((2 * lvl) / 5 + 2) * atkPow * (cbtPow / cbtDef)) / 50 + 2) *
    stab *
    y *
    (random(85, 100) / 100)
  );
};

/**
 * Calculates the maximum HP of a Pokémon based on its base HP and level.
 * @param {number} baseHP - The base HP of the Pokémon.
 * @param {number} level - The level of the Pokémon.
 * @returns {number} The maximum HP of the Pokémon.
 */
const calcMaxHP = (baseHP, level) =>
  Math.round((level / 50) * baseHP + level + 10);

/**
 * Calculates a Pokémon's stat based on its base stat and level.
 * @param {number} baseStat - The base stat of the Pokémon.
 * @param {number} level - The level of the Pokémon.
 * @returns {number} The calculated stat.
 */
const calcStat = (baseStat, level) => Math.round((level / 50) * baseStat + 5);

/**
 * Determines the catch rate of a Pokémon.
 * @param {number} captureRate - The base capture rate of the Pokémon.
 * @param {number} hp - The current HP of the Pokémon.
 * @param {number} maxHP - The maximum HP of the Pokémon.
 * @param {number} status - The status effect multiplier.
 * @param {number} ball - The effectiveness of the Pokéball used.
 * @param {number} level - The level of the Pokémon.
 * @returns {number} The catch rate.
 */
const catchRate = (captureRate, hp, maxHP, status, ball, level) => {
  const a = (captureRate * (3 * maxHP - 2 * hp)) / (3 * maxHP);
  const b = a * ball * status;
  const c = Math.floor(Math.max((36 - 2 * level) / 10, 1) * b);
  return c >= 255 ? 255 : c;
};

/**
 * Calculates the chance of catching a Pokémon.
 * @param {number} captureRate - The base capture rate of the Pokémon.
 * @param {number} hp - The current HP of the Pokémon.
 * @param {number} maxHP - The maximum HP of the Pokémon.
 * @param {number} status - The status effect on the Pokémon.
 * @param {number} ball - The effectiveness of the Pokéball used.
 * @param {number} level - The level of the Pokémon.
 * @returns {number} The percentage chance of catching the Pokémon.
 */
const catchChance = (captureRate, hp, maxHP, status, ball, level) => {
  const rate = catchRate(captureRate, hp, maxHP, status, ball, level);
  const chance = (rate / 255) * 100;
  return chance >= 100 ? 100 : chance;
};

// Right now every pokemon of a species that is the same level has the same stats, potential
// TODO: implement IVs and maybe EVs
// Also shiny check will run even when pokemon evolves
/**
 * Creates a new Pokémon object.
 * @param {number} id - The ID of the Pokémon.
 * @param {number} level - The level of the Pokémon.
 * @returns {Object} A new Pokémon object.
 */
const createPokemon = (
  name,
  level,
  uuid = short.generate(),
  isShiny = Math.random() < 1 / 4096 ? true : false,
  pokemonKnockedOut = 0,
  bisharpKnockedOut = 0
) => {
  const newLevel = level;
  const pokemon = pokes.find((poke) => poke.name === name);

  const id = pokemon.id;
  let image = pokemon.sprites.front_default;
  if (isShiny && pokemon.sprites?.front_shiny) {
    image = isShiny
      ? pokemon.sprites.front_shiny
      : pokemon.sprites.front_default;
  }
  const growthRate = pokemon.growthRate;
  const hp = calcMaxHP(pokemon.stats[0].base_stat, newLevel);
  const attack = calcStat(pokemon.stats[1].base_stat, newLevel);
  const defense = calcStat(pokemon.stats[2].base_stat, newLevel);
  const spAttack = calcStat(pokemon.stats[3].base_stat, newLevel);
  const spDefense = calcStat(pokemon.stats[4].base_stat, newLevel);
  const speed = calcStat(pokemon.stats[5].base_stat, newLevel);
  const gender = Math.random() > pokemon.genderRate / 8 ? "male" : "female";
  let xp;
  switch (growthRate) {
    case "fast":
      xp = fastGrowth(newLevel);
      break;
    case "medium-fast":
      xp = mediumFastGrowth(newLevel);
      break;
    case "medium-slow":
      xp = mediumSlowGrowth(newLevel);
      break;
    case "slow":
      xp = slowGrowth(newLevel);
      break;
    case "fluctuating":
      xp = fluctuatingGrowth(newLevel);
      break;
    case "slow-then-very-fast":
      xp = fluctuatingGrowth(newLevel);
      break;
    case "erratic":
      xp = erraticGrowth(newLevel);
      break;
    default:
      xp = mediumFastGrowth(newLevel);
  }

  return {
    uuid,
    id,
    name: pokemon.name,
    image: image,
    isShiny,
    level: newLevel,
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
    happiness: 0,
    affection: 0,
    pokemonKnockedOut,
    bisharpKnockedOut,
  };
};

/**
 * Determines the amount of experience needed to reach the provided level.
 * @param {number} level - The level we want to calculate the experience for.
 * @returns {number} The amount of experience of the level.
 */
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

/**
 * Determines the amount of experience needed to reach the provided level.
 * @param {number} level - The level we want to calculate the experience for.
 * @returns {number} The amount of experience of the level.
 */
const fastGrowth = (level) => {
  return (level ** 3 * 4) / 5;
};

/**
 * Determines the amount of experience needed to reach the provided level.
 * @param {number} level - The level we want to calculate the experience for.
 * @returns {number} The amount of experience of the level.
 */
const mediumFastGrowth = (level) => {
  return level ** 3;
};

/**
 * Determines the amount of experience needed to reach the provided level.
 * @param {number} level - The level we want to calculate the experience for.
 * @returns {number} The amount of experience of the level.
 */
const mediumSlowGrowth = (level) => {
  return (6 / 5) * level ** 3 - 15 * level ** 2 + 100 * level - 140;
};

/**
 * Determines the amount of experience needed to reach the provided level.
 * @param {number} level - The level we want to calculate the experience for.
 * @returns {number} The amount of experience of the level.
 */
const slowGrowth = (level) => {
  return (5 / 4) * level ** 3;
};

/**
 * Determines the amount of experience needed to reach the provided level.
 * @param {number} level - The level we want to calculate the experience for.
 * @returns {number} The amount of experience of the level.
 */
const fluctuatingGrowth = (level) => {
  if (level <= 15) {
    return level ** 3 * (((level + 1) / 3 + 24) / 50);
  } else if (level <= 36) {
    return level ** 3 * ((level + 14) / 50);
  } else {
    return level ** 3 * ((level / 2 + 32) / 50);
  }
};

/**
 * Calculates the amount of experience gained from defeating a Pokémon.
 * @param {number} base - The base experience of the Pokémon.
 * @param {number} levelEnemy - The level of the defeated Pokémon.
 * @param {number} levelTrainer - The level of the trainer's Pokémon.
 */
const experienceGain = (base, levelEnemy, levelTrainer) => {
  let xp = (base * levelEnemy) / 5;
  xp *= ((levelEnemy * 2 + 10) / (levelEnemy + levelTrainer + 10)) ** 2.5;
  return xp;
};

/**
 * Calculates the total rarity of a list of Pokémon.
 * @param {Array} pokemonList - The list of Pokémon.
 * @returns {Array} The total rarity and a dictionary of the rarity of each Pokémon.
 */
function getTotalRarity(pokemonList) {
  const pokemonRarity = {};
  const totalRarity = pokemonList.reduce((total, pokemon) => {
    const poke = pokes.find((p) => p.name === pokemon);

    pokemonRarity[pokemon] = poke?.rarity || 0;
    if (!poke) {
      return total;
    }
    return total + poke.rarity;
  }, 0);
  return [totalRarity, pokemonRarity];
}

/**
 * Determines which Pokémon will spawn in a given area.
 * @param {Array} pokemonList - The list of Pokémon that can spawn in the area.
 * @returns {number} The ID of the Pokémon that will spawn.
 */
function determineSpawn(pokemonList) {
  const [totalRarity, pokemonRarity] = getTotalRarity(pokemonList);
  let randomNum = Math.floor(Math.random() * totalRarity) + 1;

  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    randomNum -= pokemonRarity[pokemon];

    if (randomNum <= 0) {
      return pokemon;
    }
  }
}

const affectionLevels = [0, 1, 50, 100, 150, 255];
/**
 * Checks if a Pokémon can evolve.
 * @param {object} pokemon - The Pokémon to check.
 * @param {number} level The level of the Pokémon.
 * @param {string} area The area the Pokémon is in.
 * @param {string} item The item used on the Pokémon.
 * @returns {(string|boolean)} The name of the Pokémon it evolves into, or false if it doesn't evolve.
 */
function checkEvolve(
  pokemon,
  level = 1,
  area = null,
  item = null,
  location = null
) {
  const evolutions = pokes.find((p) => p.id === pokemon.id).evolvesTo;
  if (!evolutions) {
    return false;
  }
  for (let evolution of evolutions) {
    for (let condition of evolution.evolution_conditions) {
      if (!!item) {
        if (condition.trigger === "use-item") {
          if (condition.item === item) {
            return evolution.pokemon_name;
          }
        }
      } else if (!!location) {
        if (condition.trigger === "location") {
          if (condition.location === location) {
            return evolution.pokemon_name;
          }
        }
      } else {
        if (condition.trigger === "level-up") {
          if (
            level >= condition.level &&
            !(pokemon.happiness < affectionLevels[condition.min_affection]) &&
            !(pokemon.happiness < condition.min_happiness)
          ) {
            return evolution.pokemon_name;
          }
        } else if (condition.trigger === "other") {
          if (pokemon.pokemonKnockedOut < condition.knock_outs) {
            return evolution.pokemon_name;
          }
          if (pokemon.bisharpKnockedOut > condition.bisharp_knock_outs) {
            return evolution.pokemon_name;
          }
        }
      }
    }
  }
  return false;
}

export {
  checkEvolve,
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
  legendaryNames,
  fastGrowth,
  slowGrowth,
  erraticGrowth,
  mediumFastGrowth,
  mediumSlowGrowth,
  fluctuatingGrowth,
  determineSpawn,
};
