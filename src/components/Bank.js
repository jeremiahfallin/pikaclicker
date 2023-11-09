import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Image,
  RadioGroup,
  Radio,
  Select,
  SimpleGrid,
  Text,
  Stack,
} from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";

export default function Bank({
  bank,
  selectedPokemon,
  setSelectedPokemon,
  releasePokemon,
}) {
  const [sortBy, setSortBy] = useState("id"); // ["id", "level", "name"
  const [release, setRelease] = useState(null);
  const swapPokemon = useGameStore((state) => state.swapPokemon);
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
      <SimpleGrid
        columns={3}
        spacing={10}
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
          .map((pokemon, idx) => {
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
                  <Text>{pokemon.name}</Text>
                  <Text>
                    Lvl. {pokemon.level} {Math.floor(pokemon.xp)} xp
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
              </Center>
            );
          })}
      </SimpleGrid>
    </Box>
  );
}
