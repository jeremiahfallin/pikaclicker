import useGameStore from "@/hooks/useGameStore";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";

export default function Badges() {
  const badges = useGameStore((state) => state.player.badges);

  return (
    <Box>
      <Heading size={"md"}>Badges</Heading>
      <SimpleGrid columns={4}>
        {[...badges].map((badge) => (
          <Box key={badge}>{badge}</Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
