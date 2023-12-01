import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Image,
  Input,
  Progress,
  RadioGroup,
  Radio,
  SimpleGrid,
  Text,
  Stack,
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

export default function Bank({ selectedPokemon, setSelectedPokemon }) {
  const [sortBy, setSortBy] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [release, setRelease] = useState(null);
  const swapPokemon = useGameStore((state) => state.swapPokemon);
  const bank = useGameStore((state) => state.player.bank);
  const releasePokemon = useGameStore((state) => state.releasePokemon);
  const setPokemon = (idx) => {
    setSelectedPokemon((prev) => {
      if (prev.idx === null) {
        return {
          idx: idx,
          place: "bank",
        };
      } else if (prev.idx === idx && prev.place === "bank") {
        return {
          idx: null,
          place: null,
        };
      } else {
        swapPokemon(idx, "bank", selectedPokemon.idx, selectedPokemon.place);
        return {
          idx: null,
          place: null,
        };
      }
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box>
      <div>Bank</div>
      <RadioGroup value={sortBy} onChange={setSortBy}>
        <Stack direction="row" gap={8} align="center">
          <Radio value={"id"}>ID</Radio>
          <Radio value={"level"}>Level</Radio>
          <Radio value={"name"}>Name</Radio>
        </Stack>
      </RadioGroup>
      <Input value={searchTerm} onChange={handleSearch} size="xs" />
      <SimpleGrid
        columns={2}
        spacing={1}
        maxH="300px"
        overflowY={"scroll"}
        scrollBehavior={"smooth"}
        sx={{
          "&::-webkit-scrollbar": { width: "9px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "gray.400",
            borderRadius: "24px",
            border: "2px solid transparent",
          },
        }}
      >
        {bank
          .sort((a, b) => {
            switch (sortBy) {
              case "id":
                return a.id - b.id;
              case "level":
                return b.level - a.level;
              case "name":
                return a.name.localeCompare(b.name);
              default:
                return a.id - b.id;
            }
          })
          .filter((poke) => poke.name.includes(searchTerm))
          .map((pokemon, idx) => {
            const currentLevelXp = levelFormulas[pokemon.growthRate](
              pokemon.level
            );
            const nextLevelXp = levelFormulas[pokemon.growthRate](
              pokemon.level + 1
            );
            return (
              <Center key={`${pokemon.id}-${idx}`} flexDir={"column"}>
                <Box
                  onClick={() => setPokemon(idx)}
                  background={
                    selectedPokemon.idx === idx &&
                    selectedPokemon.place === "bank"
                      ? "green.200"
                      : null
                  }
                  borderRadius={"md"}
                >
                  <Image alt={pokemon.name} src={pokemon.image} />
                  <Text>
                    {pokemon.name} Lvl. {pokemon.level}
                  </Text>
                </Box>
                <Button
                  colorScheme={idx === release ? "red" : "gray"}
                  onClick={() => {
                    setSelectedPokemon({
                      idx: null,
                      place: null,
                    });
                    if (idx !== release) {
                      setRelease(idx);
                    } else {
                      releasePokemon(idx);
                      setRelease(null);
                    }
                  }}
                >
                  Release
                </Button>
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
