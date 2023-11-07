import { useState } from "react";
import { Box, Button, Center, Image, SimpleGrid, Text } from "@chakra-ui/react";

export default function Bank({
  bank,
  selectedPokemon,
  setSelectedPokemon,
  swapPokemon,
  releasePokemon,
}) {
  const [release, setRelease] = useState(null);
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
        {bank.map((pokemon, idx) => {
          return (
            <Center key={`${pokemon.id}-${idx}`} flexDir={"column"}>
              <Box
                onClick={() => setPokemon(idx)}
                border={
                  selectedPokemon.idx === idx &&
                  selectedPokemon.place === "bank"
                    ? "1px solid red"
                    : null
                }
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
