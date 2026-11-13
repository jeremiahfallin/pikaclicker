import { Box, Flex, Image, Progress, SimpleGrid, Text } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import { formatName, hpColorScheme } from "@/utils/display";
import Panel from "./Panel";
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
    <Panel title="Party" extra={<Text fontSize="sm">{party.length}/6</Text>}>
      {party.length === 0 && (
        <Text fontSize="sm" color="sky.700">
          Choose your starter to begin.
        </Text>
      )}
      <SimpleGrid columns={2} spacing={2}>
        {party.map((pokemon) => {
          const currentLevelXp =
            levelFormulas[pokemon.growthRate](pokemon.level) || 0;
          const nextLevelXp =
            levelFormulas[pokemon.growthRate](pokemon.level + 1) || 0;
          const uuid = pokemon.uuid;
          const name = formatName(pokemon.name);
          const hp = (100 * pokemon.currentHP) / pokemon.maxHP;
          const isSelected =
            selectedPokemon.uuid === uuid && selectedPokemon.place === "party";

          return (
            <Flex
              as="button"
              type="button"
              key={`${pokemon.id}-${uuid}`}
              direction="column"
              w="100%"
              bg={isSelected ? "gold.100" : "sky.50"}
              border="2px solid"
              borderColor={isSelected ? "gold.500" : "transparent"}
              _hover={{ borderColor: isSelected ? "gold.500" : "sky.300" }}
              _focusVisible={{ borderColor: "sky.500", outline: "none" }}
              aria-pressed={isSelected}
              aria-label={`Select ${name}, Level ${pokemon.level}`}
              borderRadius="lg"
              onClick={() => setPokemon(uuid)}
              p={2}
              textAlign="left"
              transition="all 0.15s"
            >
              {/* Name beside the sprite on wide screens, below it otherwise.
                  Decided by screen size so every card matches. */}
              <Flex
                direction={{ base: "column", xl: "row" }}
                align="center"
                justify="center"
                gap={1}
                minW="0"
                maxW="100%"
                textAlign={{ base: "center", xl: "left" }}
              >
                <Image alt="" src={pokemon.image} boxSize="72px" />
                <Box minW="0" maxW="100%" fontSize="sm">
                  <Text fontWeight={700} noOfLines={1}>
                    {name}
                  </Text>
                  <Text color="sky.700">Lv {pokemon.level}</Text>
                </Box>
              </Flex>
              <Progress
                size="xs"
                w="100%"
                mt={1}
                colorScheme={hpColorScheme(hp)}
                value={hp}
                aria-label={`${name} HP`}
              />
              <Progress
                size="xs"
                w="100%"
                mt={1}
                colorScheme="purple"
                value={
                  (100 * (pokemon.xp - currentLevelXp)) /
                  (nextLevelXp - currentLevelXp)
                }
                aria-label={`${name} experience to next level`}
              />
            </Flex>
          );
        })}
      </SimpleGrid>
    </Panel>
  );
}
