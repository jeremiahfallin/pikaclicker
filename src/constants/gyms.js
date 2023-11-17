import { createPokemon } from "@/utils";

// TODO: Add other gyms
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
];
export default gyms;
