import { createPokemon } from "@/utils";

const gyms = [
  {
    name: "Grass",
    type: "grass",
    badge: "Grass",
    leader: "Yara",
    town: "Home",
    pokemon: [
      createPokemon("bulbasaur", 12), // Bulbasaur
      createPokemon("beedrill", 12), // Beedrill
      createPokemon("shroomish", 16), // Shroomish
      createPokemon("gloom", 18), // Gloom
      createPokemon("leafeon", 18), // Leafeon
      createPokemon("lilligant-hisui", 18), // Lilligant-Hisui
    ],
  },
  {
    name: "Fire",
    type: "fire",
    badge: "Fire",
    leader: "Richter",
    town: "Volcano Town",
    pokemon: [
      createPokemon("charcadet", 20), // Charcadet
      createPokemon("rapidash", 20), // Rapidash
      createPokemon("arcanine", 24), // Arcanine
      createPokemon("flareon", 24), // Flareon
      createPokemon("centiskorch", 28), // Centiskorch
      createPokemon("crocalor", 28), // Crocalor
    ],
  },
  {
    name: "Swamp",
    type: "poison",
    badge: "Swamp",
    leader: "",
    town: "Swamp Town",
    pokemon: [
      createPokemon("haunter", 32), // Haunter
      createPokemon("clodsire", 32), // Clodsire
      createPokemon("chandelure", 32), // Chandelure
      createPokemon("arbok", 34), // Arbok
      createPokemon("sableye", 36), // Sableye
      createPokemon("muk-alola", 36), // Muk-Alola
    ],
  },
  {
    name: "Rock",
    type: "rock",
    badge: "Rock",
    leader: "",
    town: "Rock Town",
    pokemon: [
      createPokemon("arcanine-hisui", 40), // Arcanine-Hisui
      createPokemon("shuckle", 42), // Shuckle
      createPokemon("tyranitar", 44), // Tyranitar
      createPokemon("crustle", 44), // Crustle
      createPokemon("aggron", 46), // Aggron
      createPokemon("rhyperior", 50), // Rhyperior
    ],
  },
  {
    name: "Electric",
    type: "electric",
    badge: "Electric",
    leader: "",
    town: "Electric Town",
    pokemon: [
      createPokemon("raichu-alola", 54), // Raichu-Alola
      createPokemon("luxray", 54), // Luxray
      createPokemon("jolteon", 56), // Jolteon
      createPokemon("mimikyu-disguised", 58), // Mimikyu
      createPokemon("galvantula", 58), // Galvantula
      createPokemon("ampharos", 60), // Ampharos
    ],
  },
  {
    name: "Desert",
    type: "ground",
    badge: "Desert",
    leader: "",
    town: "Desert Town",
    pokemon: [
      createPokemon("nidoking", 62), // Nidoking
      createPokemon("nidoqueen", 64), // Nidoqueen
      createPokemon("tyranitar", 66), // Tyranitar
      createPokemon("garchomp", 68), // Garchomp
      createPokemon("krookodile", 68), // Krookodile
      createPokemon("flygon", 70), // Flygon
    ],
  },
  {
    name: "Flying",
    type: "flying",
    badge: "Flying",
    leader: "",
    town: "Flying Town",
    pokemon: [
      createPokemon("gyarados", 72), // Gyarados
      createPokemon("aerodactyl", 72), // Aerodactyl
      createPokemon("dragonite", 73), // Dragonite
      createPokemon("crobat", 74), // Crobat
      createPokemon("bombirdier", 75), // Bombirdier
      createPokemon("altaria", 76), // Altaria
    ],
  },
  {
    name: "Ice",
    type: "ice",
    badge: "Ice",
    leader: "",
    town: "Ice Town",
    pokemon: [
      createPokemon("sandslash-alola", 80), // Sandslash-alola
      createPokemon("ninetales-alola", 80), // Ninetales-alola
      createPokemon("frosmoth", 82), //Frosmoth
      createPokemon("glaceon", 86), //Glaceon
      createPokemon("lapras", 86), //lapras
      createPokemon("froslass", 88), //Froslass
    ],
  },
  {
    name: "Fossil",
    type: "rock",
    badge: "Fossil",
    leader: "",
    town: "Fossil Town",
    pokemon: [
      createPokemon("omastar", 90), // Omastar
      createPokemon("kabutops", 92), // Kabutops
      createPokemon("armaldo", 94), // Armaldo
      createPokemon("archeops", 96), // Archeops
      createPokemon("aurorus", 98), // Aurorus
      createPokemon("rampardos", 100), // Rampardos
    ],
  },
];

export default gyms;
