import { createPokemon } from "@/utils";

const elite4 = {
  town: "Elite 4",
  badge: "Elite4",
  leaders: [
    {
      name: "",
      type: "water",
      leader: "",
      pokemon: [
        createPokemon("politoed", 100), // Politoed
        createPokemon("slowking", 100), // Slowking
        createPokemon("vaporeon", 100), // Vaporeon
        createPokemon("kingdra", 100), // Kingdra
        createPokemon("ludicolo", 100), // Ludicolo
        createPokemon("milotic", 100), // Milotic
      ],
    },
    {
      name: "",
      type: "fairy",
      leader: "",
      pokemon: [
        createPokemon("azumarill", 100), // Azumarill
        createPokemon("gardevoir", 100), // Gardevoir
        createPokemon("sylveon", 100), // Sylveon
        createPokemon("tinkaton", 100), // Tinkaton
        createPokemon("grimmsnarl", 100), // Grimmsnarl
        createPokemon("primarina", 100), // Primarina
      ],
    },
    {
      name: "",
      type: "psychic",
      leader: "",
      pokemon: [
        createPokemon("espeon", 100), // Espeon
        createPokemon("gallade", 100), // Gallade
        createPokemon("slowking-galar", 100), // Slowking-Galar
        createPokemon("espathra", 100), // Espathra
        createPokemon("alakazam", 100), // Alakazam
        createPokemon("togekiss", 100), // Togekiss
      ],
    },
    {
      name: "",
      type: "steel",
      leader: "",
      pokemon: [
        createPokemon("kingambit", 100), // Kingambit
        createPokemon("gholdengo", 100), // Gholdengo
        createPokemon("metagross", 100), // Metagross
        createPokemon("corviknight", 100), // Corviknight
        createPokemon("mawile", 100), // Mawile
        createPokemon("goodra-hisui", 100), // Goodra
      ],
    },
  ],
};

export default elite4;
