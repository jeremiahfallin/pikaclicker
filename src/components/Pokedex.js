import { useState } from "react";
import {
  Box,
  Center,
  Heading,
  Image,
  SimpleGrid,
  Text,
  RadioGroup,
  Radio,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import pokes from "../pokes.json";
import { getHexDetails } from "@/utils";

// TODO: Add more info to the pokedex (e.g. id#, types, etc.)
// TODO: Add filter for seen/caught
// TODO: Maybe add filter for the area you're in?

export default function Pokedex() {
  const [sortBy, setSortBy] = useState("id");
  const [inArea, setInArea] = useState(false);
  const seen = useGameStore((state) => state.player.pokedex.seen);
  const caught = useGameStore((state) => state.player.pokedex.caught);

  // 1. Find hex you're on
  const { q, r, s } = useGameStore((state) => state.player.currentHex);
  // 2. Find out which pokemon are on that hex
  const pokemonInArea = getHexDetails(q, r, s);
  // 3. Filter pokedex by those pokemon (below)

  const pokedex = [...new Set([...seen, ...caught])].flatMap((poke) => {
    if (!poke) {
      return [];
    }
    return pokes.find((p) => p.id === poke);
  });

  const handleAreaCheckbox = (e) => {
    setInArea(e.target.checked);
  };

  return (
    <Box>
      <Heading as="h3" size="md">
        <Box as="span">Pokedex</Box>{" "}
        <Box as="span">
          ({pokedex.length}/{pokes.length})
        </Box>
      </Heading>

      <Stack direction="row" gap={8} align="center">
        <RadioGroup value={sortBy} onChange={setSortBy}>
          <Stack direction="row" gap={8} align="center">
            <Radio value="id">id</Radio>
            <Radio value="name">name</Radio>
          </Stack>
        </RadioGroup>
        <Checkbox onChange={handleAreaCheckbox}>Current Area</Checkbox>
      </Stack>

      <Stack direction="row" gap={8} align="center"></Stack>
      <SimpleGrid
        columns={3}
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
        {pokedex
          .sort((a, b) => {
            switch (sortBy) {
              case "id":
                return a.id - b.id;
              case "name":
                return a.name.localeCompare(b.name);
              default:
                return a.id - b.id;
            }
          })
          .filter((poke) => {
            if (!inArea) {
              return true;
            }
            if (pokemonInArea.pokemon.includes(poke.id)) {
              return true;
            }
            return false;
          })
          .map((poke) => {
            if (caught.has(poke.id)) {
              return (
                <Center key={poke.id} flexDirection={"column"}>
                  <Text fontSize="sm">{poke.name}</Text>
                  <Image alt={poke.name} src={poke.sprites.front_default} />
                </Center>
              );
            }
            return (
              <Center key={poke.id} flexDirection={"column"}>
                <Text fontSize="sm">{poke.name}</Text>
                <Image
                  alt={poke.name}
                  src={poke.sprites.front_default}
                  filter={"grayscale(1)"}
                />
              </Center>
            );
          })}
      </SimpleGrid>
    </Box>
  );
}
