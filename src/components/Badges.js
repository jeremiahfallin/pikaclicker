import useGameStore from "@/hooks/useGameStore";
import { Box, Flex, Text } from "@chakra-ui/react";
import Panel from "./Panel";

export default function Badges() {
  const badges = useGameStore((state) => state.player.badges);

  return (
    <Panel title="Badges">
      {badges.size === 0 ? (
        <Text fontSize="sm" color="sky.700">
          Beat a gym leader to earn your first badge.
        </Text>
      ) : (
        <Flex wrap="wrap" gap={2}>
          {[...badges].map((badge) => (
            <Box
              key={badge}
              bg="gold.100"
              color="gold.900"
              border="2px solid"
              borderColor="gold.300"
              borderRadius="full"
              px={3}
              py={0.5}
              fontSize="sm"
              fontWeight={700}
            >
              {badge} Badge
            </Box>
          ))}
        </Flex>
      )}
    </Panel>
  );
}
