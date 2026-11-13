import { Box, Center, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";

export default function Items({ selectedPokemon }) {
  const items = useGameStore((state) => state.player.items);
  const coins = useGameStore((state) => state.player.coins);
  const applyItemOnPokemon = useGameStore((state) => state.applyItemOnPokemon);

  const handleClick = (item) => {
    if (!selectedPokemon.uuid) return;
    applyItemOnPokemon(item, selectedPokemon.uuid, selectedPokemon.place);
  };

  return (
    <Box overflowX="hidden" w="100%">
      <Flex gap={2} align={"center"}>
        <Heading as="h3" size="md">
          Items
        </Heading>
        <Text fontSize="sm"> - ({coins} coins)</Text>
      </Flex>
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
          const isDisabled = !selectedPokemon?.uuid || item.quantity === 0;
          let tooltipMessage = "";
          if (item.quantity === 0) {
            tooltipMessage = `You have no ${item.name}s left.`;
          } else if (!selectedPokemon?.uuid) {
            tooltipMessage = "Select a Pokémon first to use an item.";
          }

          return (
            <Tooltip
              key={item.name}
              label={tooltipMessage}
              isDisabled={!isDisabled}
              hasArrow
              shouldWrapChildren
            >
              <Center
                as="button"
                aria-label={`Use ${item.name} (${item.quantity} left)`}
                aria-disabled={isDisabled}
                disabled={isDisabled}
                opacity={isDisabled ? 0.5 : 1}
                cursor={isDisabled ? "not-allowed" : "pointer"}
                _hover={!isDisabled ? { background: "gray.100" } : undefined}
                _focusVisible={{ outline: "2px solid", outlineColor: "blue.400", outlineOffset: "2px" }}
                borderRadius="md"
                flex="0 0 auto"
                flexDir={"column"}
                onClick={() => handleClick(item)}
                p={2}
              >
                <Text>{item.name}</Text>
                <Text>{item.quantity}</Text>
              </Center>
            </Tooltip>
          );
        })}
      </Flex>
    </Box>
  );
}
