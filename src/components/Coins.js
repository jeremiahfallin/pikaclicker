import { Box } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";

// The player's coins, shown in the header. The save lives in the browser, so
// this is only drawn there (see Layout).
export default function Coins() {
  const coins = useGameStore((state) => state.player.coins);

  return (
    <Box
      bg="gold.300"
      color="gold.900"
      borderRadius="full"
      px={3}
      py={0.5}
      fontSize="sm"
      fontWeight={700}
      whiteSpace="nowrap"
    >
      {coins.toLocaleString()} coins
    </Box>
  );
}
