import {
  Box,
  Center,
  Image,
  Progress,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import {
  fastGrowth,
  slowGrowth,
  erraticGrowth,
  mediumFastGrowth,
  mediumSlowGrowth,
  fluctuatingGrowth,
} from "@/utils";

const levelFormulas = {
  erratic: erraticGrowth,
  fast: fastGrowth,
  "medium-fast": mediumFastGrowth,
  medium: mediumFastGrowth,
  "medium-slow": mediumSlowGrowth,
  slow: slowGrowth,
  fluctuating: fluctuatingGrowth,
  "fast-then-very-slow": fluctuatingGrowth,
};

export default function Party({ selectedPokemon, setSelectedPokemon }) {
  const swapPokemon = useGameStore((state) => state.swapPokemon);
  const party = useGameStore((state) => state.player.party);
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

      <SimpleGrid columns={2} spacing={1}>
        {party.map((pokemon, idx) => {
          const currentLevelXp = levelFormulas[pokemon.growthRate](
            pokemon.level
          );
          const nextLevelXp = levelFormulas[pokemon.growthRate](
            pokemon.level + 1
          );
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
              <Text>Lvl. {pokemon.level}</Text>
              <Box w="100%">
                <Progress
                  size={"xs"}
                  colorScheme="green"
                  value={(100 * pokemon.currentHP) / pokemon.maxHP}
                />
              </Box>
              <Box w="100%">
                <Progress
                  size={"xs"}
                  colorScheme="pink"
                  value={
                    (100 * (pokemon.xp - currentLevelXp)) /
                    (nextLevelXp - currentLevelXp)
                  }
                />
              </Box>
            </Center>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
