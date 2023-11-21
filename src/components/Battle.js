import { useState, useEffect } from "react";
import { Box, Flex, Image, Progress, keyframes } from "@chakra-ui/react";
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
      overflow="hidden"
    >
      <Image src={sprite} alt={details?.name} />
      <Progress
        value={(100 * details.currentHP) / details.maxHP}
        colorScheme="green"
      />
    </Box>
  );
}

// Animation for the initiative slider.
const slide = keyframes`
  0% {
    left: -40px;
  }
  100% {
    left: 100%;
  }
`;

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
  const playerSpeed = playerPokemon.speed;
  // Retrieving the enemy Pokémon.
  const enemyPokemon = useGameStore((state) => state.battle.pokemon[0]);
  const enemySpeed = enemyPokemon.speed;

  // Function to handle the end of the animation.
  const handleAnimationIteration = (e) => {
    if (e.target.alt === playerPokemon.name) {
      handleTurn("player");
    } else {
      handleTurn();
    }
  };

  const speedNumerator = 100;
  return (
    <Flex position="relative" h="50px" align="center" overflow="hidden">
      <Image
        src={playerPokemon.image}
        alt={playerPokemon.name}
        boxSize="40px"
        position="absolute"
        animation={`${slide} ${speedNumerator / playerSpeed}s linear infinite`}
        onAnimationIteration={handleAnimationIteration}
      />
      <Image
        src={enemyPokemon.image}
        alt={enemyPokemon.name}
        boxSize="40px"
        position="absolute"
        animation={`${slide} ${speedNumerator / enemySpeed}s linear infinite`}
        onAnimationIteration={handleAnimationIteration}
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
  const enemyPokemon = useGameStore((state) => state.battle.pokemon[0]);
  // Hook to handle game turns.
  const handleTurn = useGameStore((state) => state.handleTurn);
  const handleClick = () => {
    handleTurn("player");
  };

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
      onClick={handleClick}
      overflow="hidden"
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
