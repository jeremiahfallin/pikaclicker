import { useState, useEffect } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import useGameStore, { updateBadges } from "@/hooks/useGameStore";
import Battle from "@/components/Battle";

// Gym component manages the gym interactions, including battles and challenges.
export default function Gym({ gym, setInGym }) {
  const [inBattle, setInBattle] = useState(false); // State to track if a battle is ongoing.
  const updateBattle = useGameStore((state) => state.updateBattle);
  const isComplete = useGameStore((state) => state.battle.isComplete);
  const background = inBattle ? `${gym?.type}-gym-battle` : `${gym?.type}-gym`;
  const battle = useGameStore((state) => state.battle.pokemon);

  // Check if the battle is complete to update the badges and reset battle state.
  useEffect(() => {
    if (isComplete) {
      updateBadges(gym.badge);
      setInBattle(false);
    }
  }, [isComplete, gym.badge]);

  // If in battle and not complete, render the Battle component.
  if (inBattle && !isComplete && !!battle) {
    return <Battle background={background} />;
  }

  // Render the gym interface with challenge and leave buttons.
  return (
    <Box
      background={`url(backgrounds/${background}.png)`}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      backgroundPosition={"center"}
      position={"relative"}
      h={200}
    >
      <Flex position={"absolute"} top={0} left={0} direction="column" gap={2}>
        <Button
          size={"sm"}
          colorScheme="green"
          onClick={() => {
            updateBattle({
              pokemon: gym.pokemon,
              isTrainer: true,
              isComplete: false,
            });
            setInBattle(true);
          }}
        >
          Challenge
        </Button>
        <Button
          size={"sm"}
          colorScheme="green"
          onClick={() => {
            setInGym(false);
          }}
        >
          Leave
        </Button>
      </Flex>
    </Box>
  );
}
