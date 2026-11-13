import { useState, useEffect } from "react";
import { Button, Flex } from "@chakra-ui/react";
import useGameStore, { updateBadges } from "@/hooks/useGameStore";
import Battle from "@/components/Battle";
import SceneFrame from "@/components/SceneFrame";

// Gym component manages the gym interactions, including battles and challenges.
export default function Elite4({ elite4, setInElite4 }) {
  const [inBattle, setInBattle] = useState(false); // State to track if a battle is ongoing.
  const [elite4Stage, setElite4Stage] = useState(0); // State to track the current stage of the Elite 4.
  const updateBattle = useGameStore((state) => state.updateBattle);
  const isComplete = useGameStore((state) => state.battle.isComplete);
  const enemyPokemon = useGameStore((state) => state.battle?.pokemon?.[0]);
  const background = inBattle
    ? `${elite4?.type}-elite4-battle`
    : `${elite4?.type}-elite4`;

  useEffect(() => {
    updateBattle({
      pokemon: null,
      isTrainer: false,
      isComplete: false,
    });
  }, [isComplete]);

  // Check if the battle is complete to update the badges and reset battle state.
  useEffect(() => {
    if (elite4Stage === 4) {
      updateBadges(elite4.badge);
      setElite4Stage((prev) => prev + 1);
      setInBattle(false);
      setElite4Stage(0);
    } else if (isComplete && elite4Stage < 4) {
      setElite4Stage((prev) => prev + 1);
      setInBattle(false);
    }
  }, [isComplete, elite4.badge, elite4Stage]);

  // If in battle and not complete, render the Battle component.
  if (inBattle && !isComplete && !!enemyPokemon) {
    return <Battle background={background} />;
  }

  // Render the elite4 interface with challenge and leave buttons.
  return (
    <SceneFrame background={background}>
      <Flex position={"absolute"} top={2} left={2} direction="column" gap={2}>
        <Button
          size={"sm"}
          variant="scene"
          onClick={() => {
            updateBattle({
              pokemon: elite4.leaders[elite4Stage].pokemon,
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
          variant="scene"
          onClick={() => {
            setInElite4(false);
          }}
        >
          Leave
        </Button>
      </Flex>
    </SceneFrame>
  );
}
