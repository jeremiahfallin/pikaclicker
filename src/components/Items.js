import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import Panel from "./Panel";

export default function Items({ selectedPokemon }) {
  const items = useGameStore((state) => state.player.items);
  const applyItemOnPokemon = useGameStore((state) => state.applyItemOnPokemon);
  const hasSelection = !!selectedPokemon?.uuid;

  const handleClick = (item) => {
    if (!selectedPokemon.uuid) return;
    applyItemOnPokemon(item, selectedPokemon.uuid, selectedPokemon.place);
  };

  return (
    <Panel
      title="Items"
      extra={
        !hasSelection && (
          <Text fontSize="xs" color="sky.700">
            Pick a Pokémon to use one
          </Text>
        )
      }
    >
      <Flex
        maxW="100%"
        minW="0"
        gap={2}
        pb={1}
        overflowX="auto"
        wrap="nowrap"
        whiteSpace="nowrap"
        scrollBehavior={"smooth"}
        sx={{
          "&::-webkit-scrollbar": { height: "5px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "sky.300",
            borderRadius: "24px",
          },
          scrollbarWidth: "thin",
        }}
      >
        {items.map((item) => {
          const isDisabled = !hasSelection || item.quantity === 0;
          let tooltipMessage = "";
          if (item.quantity === 0) {
            tooltipMessage = `You have no ${item.name}s left.`;
          } else if (!hasSelection) {
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
              <Flex
                as="button"
                type="button"
                aria-label={`Use ${item.name} (${item.quantity} left)`}
                aria-disabled={isDisabled}
                disabled={isDisabled}
                align="center"
                gap={1.5}
                flex="0 0 auto"
                bg="sky.50"
                border="2px solid"
                borderColor="transparent"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="sm"
                opacity={item.quantity === 0 ? 0.4 : hasSelection ? 1 : 0.7}
                cursor={isDisabled ? "not-allowed" : "pointer"}
                _hover={!isDisabled ? { borderColor: "sky.300" } : undefined}
                _focusVisible={{ borderColor: "sky.500", outline: "none" }}
                transition="all 0.15s"
                onClick={() => handleClick(item)}
              >
                <Text fontWeight={600}>{item.name}</Text>
                <Box
                  bg="white"
                  color="sky.700"
                  borderRadius="full"
                  px={1.5}
                  fontSize="xs"
                  fontWeight={700}
                >
                  ×{item.quantity}
                </Box>
              </Flex>
            </Tooltip>
          );
        })}
      </Flex>
    </Panel>
  );
}
