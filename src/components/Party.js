import {
  Box,
  Center,
  Flex,
  Heading,
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
  "slow-then-very-fast": fluctuatingGrowth,
};

export default function Party({ selectedPokemon, setSelectedPokemon }) {
  const swapPokemon = useGameStore((state) => state.swapPokemon);
  const party = useGameStore((state) => state.player.party);
  const setPokemon = (uuid) => {
    if (selectedPokemon.uuid === null) {
      setSelectedPokemon({
        uuid: uuid,
        place: "party",
      });
    } else if (
      selectedPokemon.uuid === uuid &&
      selectedPokemon.place === "party"
    ) {
      setSelectedPokemon({
        uuid: null,
        place: null,
      });
    } else {
      swapPokemon(uuid, "party", selectedPokemon.uuid, selectedPokemon.place);
      setSelectedPokemon({
        uuid: null,
        place: null,
      });
    }
  };

  return (
    <Box w="100%">
      <Heading size="md">Party</Heading>

      <SimpleGrid columns={2} spacing={1}>
        {party.map((pokemon) => {
          const currentLevelXp =
            levelFormulas[pokemon.growthRate](pokemon.level) || 0;
          const nextLevelXp =
            levelFormulas[pokemon.growthRate](pokemon.level + 1) || 0;
          const uuid = pokemon.uuid;

          return (
            <Center
              key={`${pokemon.id}-${uuid}`}
              flexDir={"column"}
              background={
                selectedPokemon.uuid === uuid &&
                selectedPokemon.place === "party"
                  ? "green.200"
                  : null
              }
              borderRadius={"md"}
              onClick={() => setPokemon(uuid)}
            >
              <Center gap={2}>
                <Image alt={pokemon.name} src={pokemon.image} />
                <Flex direction={"column"} fontSize="sm">
                  <Text>{pokemon.name}</Text>
                  <Box>Lvl. {pokemon.level}</Box>
                  <Box>{pokemon.gender}</Box>
                </Flex>
              </Center>
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
    </Box>
  );
}
