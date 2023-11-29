import { createPokemon } from "@/utils";

const gyms = [
  {
    name: "Grass",
    type: "grass",
    badge: "Grass",
    leader: "Yara",
    town: "Home",
    pokemon: [
      createPokemon(1, 12), // Bulbasaur
      createPokemon(15, 12), // Beedrill
      createPokemon(285, 16), // Shroomish
      createPokemon(44, 18), // Gloom
      createPokemon(470, 18), // Leafeon
      createPokemon(10237, 18), // Liligant-Hisui
    ],
  },
  {
    name: "Fire",
    type: "fire",
    badge: "Fire",
    leader: "Richter",
    town: "Desert Town",
    pokemon: [
      createPokemon(935, 20), // Charcadet
      createPokemon(78, 20), // Rapidash
      createPokemon(59, 24), // Arcanine
      createPokemon(136, 24), // Flareon
      createPokemon(851, 28), // Centiskorch
      createPokemon(910, 28), // Crocalor
    ],
  },
  {
    name: "Swamp",
    type: "poison",
    badge: "Swamp",
    leader: "",
    town: "Swamp Town",
    pokemon: [
      createPokemon(93, 32), // Haunter
      createPokemon(980, 32), // Clodsire
      createPokemon(609, 32), // Chandelure
      createPokemon(24, 34), // Arbok
      createPokemon(302, 36), // Sableye
      createPokemon(10113, 36), // Muk-Alola
    ],
  },
  {
    name: "Rock",
    type: "rock",
    badge: "Rock",
    leader: "",
    town: "Rock Town",
    pokemon: [
      createPokemon(10230, 40), // Arcanine-Hisui
      createPokemon(213, 42), // Shuckle
      createPokemon(248, 44), // Tyranitar
      createPokemon(558, 44), // Crustle
      createPokemon(306, 46), // Aggron
      createPokemon(464, 50), // Rhyperior
    ],
  },
  {
    name: "Electric",
    type: "electric",
    badge: "Electric",
    leader: "",
    town: "Electric Town",
    pokemon: [
      createPokemon(26, 54), // Raichu-Alola
      createPokemon(404, 54), // Luxray
      createPokemon(135, 56), // Jolteon
      createPokemon(778, 58), // Mimikyu
      createPokemon(596, 58), // Galvantula
      createPokemon(181, 60), // Ampharos
    ],
  },
  {
    name: "Desert",
    type: "ground",
    badge: "Desert",
    leader: "",
    town: "Desert Town",
    pokemon: [
      createPokemon(34, 62), // Nidoking
      createPokemon(31, 64), // Nidoqueen
      createPokemon(248, 66), // Tyranitar
      createPokemon(445, 68), // Garchomp
      createPokemon(553, 68), // Krookodile
      createPokemon(330, 70), // Flygon
    ],
  },
  {
    name: "Flying",
    type: "flying",
    badge: "Flying",
    leader: "",
    pokemon: [
      createPokemon(130, 72), // Gyarados
      createPokemon(142, 72), // Aerodactyl
      createPokemon(149, 73), // Dragonite
      createPokemon(169, 74), // Crobat
      createPokemon(962, 75), // Bombirdier
      createPokemon(334, 76), // Altaria
    ],
  },
  {
    name: "Ice",
    type: "ice",
    badge: "Ice",
    leader: "",
    pokemon: [
      // createPokemon(), // Sandslash-alola
      createPokemon(10104, 80), // Ninetales-alola
      createPokemon(873, 82), //Frosmoth
      createPokemon(471, 86), //Glaceon
      createPokemon(131, 86), //lapras
      createPokemon(478, 88), //Froslass
    ],
  },
  {
    name: "Fossil",
    type: "rock",
    badge: "Fossil",
    leader: "",
    pokemon: [
      createPokemon(139, 90), // Omastar
      createPokemon(141, 92), // Kabutops
      createPokemon(348, 94), // Armaldo
      // createPokemon(565, 96), // Archeops
      // createPokemon(10105, 98), // Aurorus
      // createPokemon(10106, 100), // Cranidos
    ],
  },
];

export default gyms;
