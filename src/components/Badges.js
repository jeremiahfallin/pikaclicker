import useGameStore from "@/hooks/useGameStore";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";

export default function Badges() {
  const badges = useGameStore((state) => state.player.badges);

  return (
    <Box>
      <Heading size={"md"}>Badges</Heading>
      <SimpleGrid col={3}>
        {[...badges].map((badge) => (
          <Text key={badge}>{badge}</Text>
        ))}
      </SimpleGrid>
    </Box>
  );
}
