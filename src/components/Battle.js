import { useState, useEffect } from "react";
import { Box, Flex, Image, Progress, useInterval } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";

/**
 * The Pokemon component displays an individual Pokémon with its sprite and health bar.
 * @param {Object} details - Details of the Pokémon, including image, name, and health points.
 * @param {string} top - CSS top property value for positioning.
 * @param {string} left - CSS left property value for positioning.
 * @param {string} bottom - CSS bottom property value for positioning.
 * @param {string} right - CSS right property value for positioning.
 * @returns A Box component containing the Pokémon image and health bar.
 */
function Pokemon({ details, top, left, bottom, right }) {
  // Return null if no details are provided to prevent rendering errors.
  if (!details) return null;
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

/**
 * InitiativeSlider component to show turn order based on Pokémon speed stats.
 * @param {Array} pokemons - Array of Pokémon objects participating in the battle.
 * @returns A visual representation of the turn order.
 */
const InitiativeSlider = () => {
  // Hook to handle game turns.
  const handleTurn = useGameStore((state) => state.handleTurn);
  // Retrieving the player's first Pokémon in the party.
  const playerPokemon = useGameStore((state) => state.player.party[0]);
  // Retrieving the enemy Pokémon.
  const enemyPokemon = useGameStore((state) => state.battle.pokemon);
  // State to track each Pokémon's position on the slider
  const [playerPosition, setPlayerPosition] = useState(0);
  const [enemyPosition, setEnemyPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerPosition >= 1000) {
        handleTurn("player");
      }
      if (enemyPosition >= 1000) {
        handleTurn();
      }
      setPlayerPosition((playerPosition) => {
        if (playerPosition >= 1000) {
          setPlayerPosition(0);
        }
        return playerPosition + playerPokemon.speed;
      });
      setEnemyPosition((enemyPosition) => {
        if (enemyPosition >= 1000) {
          setEnemyPosition(0);
        }
        return enemyPosition + enemyPokemon.speed;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [
    playerPokemon.speed,
    enemyPokemon.speed,
    handleTurn,
    enemyPosition,
    playerPosition,
  ]);

  return (
    <Flex position="relative" h="50px" align="center">
      <Image
        src={playerPokemon.image}
        alt={playerPokemon.name}
        boxSize="40px"
        position="absolute"
        left={`${playerPosition / 10}%`}
        transition="left 1s"
      />
      <Image
        src={enemyPokemon.image}
        alt={enemyPokemon.name}
        boxSize="40px"
        position="absolute"
        left={`${enemyPosition / 10}%`}
        transition="left 1s"
      />
    </Flex>
  );
};

/**
 * The Battle component represents the battle scene between the player's and enemy's Pokémon.
 * @param {string} background - The background image for the battle scene.
 * @returns A Box component representing the battle scene.
 */
export default function Battle({ background = "forest" }) {
  // Retrieving the player's first Pokémon in the party.
  const playerPokemon = useGameStore((state) => state.player.party[0]);
  // Retrieving the enemy Pokémon.
  const enemyPokemon = useGameStore((state) => state.battle.pokemon);

  // Render the battle scene with the player's and enemy's Pokémon.
  return (
    <Box
      background={`url(backgrounds/${background}.png)`}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      backgroundPosition={"center"}
      position={"relative"}
      h={200}
      userSelect={"none"}
    >
      <InitiativeSlider {...{ playerPokemon, enemyPokemon }} />
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
        <Pokemon details={{ ...enemyPokemon }} bottom={0} right={0} />
      )}
    </Box>
  );
}
