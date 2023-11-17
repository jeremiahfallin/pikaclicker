import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Progress,
  useInterval,
} from "@chakra-ui/react";
import useGameStore, { updateBadges } from "@/hooks/useGameStore";

// The Pokemon component displays an individual Pokémon with its sprite and health bar.
function Pokemon({ details, top, left, bottom, right }) {
  if (!details) return null; // Return null if no details are provided to prevent rendering errors.
  let sprite = details?.image;

  // Render a box with the Pokémon sprite and a progress bar indicating its current health.
  return (
    <Box
      position="absolute"
      top={top}
      right={right}
      left={left}
      bottom={bottom}
    >
      <Image src={sprite} alt={details?.name} />
      <Progress
        value={(100 * details.currentHP) / details.maxHP}
        colorScheme="green"
      />
    </Box>
  );
}

// The Battle component represents the battle scene between the player's and enemy's Pokémon.
function Battle({ background }) {
  const handleTurn = useGameStore((state) => state.handleTurn);
  const playerPokemon = useGameStore((state) => state.player.party[0]);
  const enemyPokemon = useGameStore((state) => state.battle.pokemon[0]);

  // Automatically advance the game every second.
  useInterval(() => {
    handleTurn();
  }, 1000);

  // Render the battle scene with the player's and enemy's Pokémon.
  return (
    <Box
      background={`url(backgrounds/${background}.png)`}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      backgroundPosition={"center"}
      position={"relative"}
      h={200}
    >
      {!!playerPokemon && (
        <Pokemon
          details={{
            ...playerPokemon,
          }}
          bottom={0}
          left={0}
        />
      )}
      {!!enemyPokemon && (
        <Pokemon details={{ ...enemyPokemon }} top={0} right={0} />
      )}
    </Box>
  );
}

// Gym component manages the gym interactions, including battles and challenges.
export default function Gym({ gym, setInGym }) {
  const [inBattle, setInBattle] = useState(false); // State to track if a battle is ongoing.
  const updateBattle = useGameStore((state) => state.updateBattle);
  const isComplete = useGameStore((state) => state.battle.isComplete);
  const background = inBattle ? `${gym.type}-gym-battle` : `${gym.type}-gym`;

  // Check if the battle is complete to update the badges and reset battle state.
  useEffect(() => {
    if (isComplete) {
      updateBadges(gym.badge);
      setInBattle(false);
    }
  }, [isComplete, gym.badge]);

  // If in battle and not complete, render the Battle component.
  if (inBattle && !isComplete) {
    return (
      <Battle gym={gym} setInBattle={setInBattle} background={background} />
    );
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
