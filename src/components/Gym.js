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

function Pokemon({ details, top, left, bottom, right }) {
  if (!details) return null;
  let sprite = details?.image;

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

function Battle({ background }) {
  const handleTurn = useGameStore((state) => state.handleTurn);
  const playerPokemon = useGameStore((state) => state.player.party[0]);
  const enemyPokemon = useGameStore((state) => state.battle.pokemon[0]);

  useInterval(() => {
    handleTurn();
  }, 1000);

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

export default function Gym({ gym, setInGym }) {
  const [inBattle, setInBattle] = useState(false);
  const updateBattle = useGameStore((state) => state.updateBattle);
  const isComplete = useGameStore((state) => state.battle.isComplete);
  const background = inBattle ? `${gym.type}-gym-battle` : `${gym.type}-gym`;

  useEffect(() => {
    if (isComplete) {
      updateBadges(gym.badge);
      setInBattle(false);
    }
  }, [isComplete, gym.badge]);

  if (inBattle && !isComplete) {
    return (
      <Battle gym={gym} setInBattle={setInBattle} background={background} />
    );
  }

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
