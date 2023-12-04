import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";

export default function Items({ selectedPokemon }) {
  const items = useGameStore((state) => state.player.items);
  const applyItemOnPokemon = useGameStore((state) => state.applyItemOnPokemon);

  const handleClick = (item) => {
    if (!selectedPokemon.uuid) return;
    applyItemOnPokemon(item, selectedPokemon.uuid, selectedPokemon.place);
  };

  return (
    <Box overflowX="hidden" maxW="100%" h="100%">
      <Heading as="h3" size="md">
        Items
      </Heading>
      <Flex
        maxW="100%"
        minW="0"
        gap={4}
        overflowX="scroll"
        wrap="nowrap"
        whiteSpace="nowrap"
        scrollBehavior={"smooth"}
        sx={{
          "&::-webkit-scrollbar": { height: "5px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "gray.400",
            borderRadius: "24px",
            border: "2px solid transparent",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "gray.400 transparent",
        }}
      >
        {items.map((item) => {
          return (
            <Center
              key={item.name}
              flex="0 0 auto"
              flexDir={"column"}
              onClick={() => handleClick(item)}
              p={2}
            >
              <Text>{item.name}</Text>
              <Text>{item.quantity}</Text>
            </Center>
          );
        })}
      </Flex>
    </Box>
  );
}
