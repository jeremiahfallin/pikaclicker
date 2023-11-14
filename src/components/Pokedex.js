import {
  Box,
  Center,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import pokes from "../pokes.json";

// TODO: Sort by ID or Name
// TODO: Add more info to the pokedex (e.g. id#, types, etc.)
// TODO: Add filter for seen/caught
// TODO: Maybe add filter for the area you're in?

export default function Pokedex() {
  const seen = useGameStore((state) => state.player.pokedex.seen);
  const caught = useGameStore((state) => state.player.pokedex.caught);

  const pokedex = [...new Set([...seen, ...caught])].map((poke) => {
    return pokes.find((p) => p.id === poke);
  });

  return (
    <Box>
      <Heading as="h3" size="md">
        Pokedex
      </Heading>
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
        {pokedex.map((poke) => {
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
