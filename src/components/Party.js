import { Center, Image, SimpleGrid, Text } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import pokes from "../pokes";

export default function Party({ party, selectedPokemon, setSelectedPokemon }) {
  const swapPokemon = useGameStore((state) => state.swapPokemon);
  const setPokemon = (idx) => {
    setSelectedPokemon((prev) => {
      if (prev.idx === null) {
        return {
          idx: idx,
          place: "party",
        };
      } else if (prev.idx === idx && prev.place === "party") {
        return {
          idx: null,
          place: null,
        };
      } else {
        swapPokemon(idx, "party", selectedPokemon.idx, selectedPokemon.place);
        return {
          idx: null,
          place: null,
        };
      }
    });
  };

  return (
    <div>
      <div>Party</div>

      <SimpleGrid columns={3} spacing={10}>
        {party.map((pokemon, idx) => {
          return (
            <Center
              key={`${pokemon.id}-${idx}`}
              flexDir={"column"}
              background={
                selectedPokemon.idx === idx && selectedPokemon.place === "party"
                  ? "green.200"
                  : null
              }
              borderRadius={"md"}
              onClick={() => setPokemon(idx)}
            >
              <Image alt={pokemon.name} src={pokemon.image} />
              <Text>{pokemon.name}</Text>
              <Text>
                Lvl. {pokemon.level} {Math.floor(pokemon.xp)} xp
              </Text>
              <Text>HP: {Math.floor(pokemon.currentHP)}</Text>
            </Center>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
