import { createPokemon } from "@/utils";

const gyms = [
  {
    name: "Grass",
    type: "grass",
    badge: "Grass",
    leader: "Yara",
    town: "Home",
    pokemon: [
      createPokemon(1, 12),
      createPokemon(15, 12),
      createPokemon(285, 16),
      createPokemon(44, 18),
      createPokemon(470, 18),
      createPokemon(10237, 18),
    ],
  },
  {
    name: "Fire",
    type: "fire",
    badge: "Fire",
    leader: "Richter",
    town: "Desert Town",
    pokemon: [
      createPokemon(935, 20),
      createPokemon(78, 20),
      createPokemon(59, 24),
      createPokemon(136, 24),
      createPokemon(851, 28),
      createPokemon(910, 28),
    ],
  },
  {
    name: "Swamp",
    type: "poison",
    badge: "Swamp",
    leader: "",
    town: "Swamp Town",
    pokemon: [
      createPokemon(93, 32),
      createPokemon(980, 32),
      createPokemon(609, 32),
      createPokemon(24, 34),
      createPokemon(302, 36),
      createPokemon(10113, 36),
    ],
  },
  {
    name: "Rock",
    type: "rock",
    badge: "Rock",
    leader: "",
    town: "Rock Town",
    pokemon: [
      createPokemon(10230, 40),
      createPokemon(213, 42),
      createPokemon(248, 44),
      createPokemon(558, 44),
      createPokemon(306, 46),
      createPokemon(464, 48),
    ],
  },
];
export default gyms;
