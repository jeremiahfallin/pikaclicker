import useGameStore from "@/hooks/useGameStore";
import { Box, Heading, Text } from "@chakra-ui/react";

export default function Badges() {
  const badges = useGameStore((state) => state.player.badges);

  return (
    <Box>
      <Heading size={"md"}>Badges</Heading>
      <Box>
        {[...badges].map((badge) => (
          <Text key={badge}>{badge}</Text>
        ))}
      </Box>
    </Box>
  );
}
