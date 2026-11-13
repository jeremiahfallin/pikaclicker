import { useEffect, useRef } from "react";
import { Box, Flex, Image, Progress } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import useBattleClock from "@/hooks/useBattleClock";
import { getTurnProgress } from "@/game/battleClock";
import { homeHex } from "@/utils";

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

const SPRITE_SIZE = 40;

/**
 * Shows how close each side is to its next turn: each sprite crosses the bar
 * once per turn, so the faster Pokémon crosses more often. The battle clock
 * decides when turns happen; this only draws it.
 */
const InitiativeSlider = () => {
  // Retrieving the player's first Pokémon in the party.
  const playerPokemon = useGameStore((state) => state.player.party[0]);
  // Retrieving the enemy Pokémon.
  const enemyPokemon = useGameStore((state) => state.battle.pokemon[0]);
  const trackRef = useRef(null);
  const playerRef = useRef(null);
  const enemyRef = useRef(null);

  // Move the sprites every frame without re-rendering.
  useEffect(() => {
    let frame;
    const draw = () => {
      const width = trackRef.current?.clientWidth ?? 0;
      const progress = getTurnProgress();
      const place = (sprite, amount) => {
        if (sprite) {
          sprite.style.left = `${-SPRITE_SIZE + amount * (width + SPRITE_SIZE)}px`;
        }
      };
      place(playerRef.current, progress.player);
      place(enemyRef.current, progress.enemy);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Flex
      ref={trackRef}
      position="relative"
      h="50px"
      align="center"
      overflow="hidden"
    >
      <Image
        ref={playerRef}
        src={playerPokemon.image}
        alt={playerPokemon.name}
        boxSize={`${SPRITE_SIZE}px`}
        position="absolute"
        left={`${-SPRITE_SIZE}px`}
      />
      <Image
        ref={enemyRef}
        src={enemyPokemon.image}
        alt={enemyPokemon.name}
        boxSize={`${SPRITE_SIZE}px`}
        position="absolute"
        left={`${-SPRITE_SIZE}px`}
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
  // Play turns while the battle is on screen.
  useBattleClock();
  // Retrieving the player's first Pokémon in the party.
  const playerPokemon = useGameStore((state) => state.player.party[0]);
  // Retrieving the enemy Pokémon.
  const enemyPokemon = useGameStore((state) => state.battle?.pokemon?.[0]);
  const updateCurrentHex = useGameStore((state) => state.updateCurrentHex);
  // With nothing to fight, send the player home. This changes game state, so
  // it runs in an effect after rendering rather than during it.
  useEffect(() => {
    if (!enemyPokemon) {
      updateCurrentHex(homeHex);
    }
  }, [enemyPokemon, updateCurrentHex]);
  const handleClick = useGameStore((state) => state.handleClick);

  if (!playerPokemon || !enemyPokemon) return null;

  // Render the battle scene with the player's and enemy's Pokémon.
  return (
    <Box
      background={`url(backgrounds/${background}.webp)`}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      backgroundPosition={"center"}
      position={"relative"}
      h={200}
      userSelect={"none"}
      onClick={() => handleClick()}
      overflow="hidden"
      id="battle"
    >
      <InitiativeSlider />
      <Pokemon details={{ ...playerPokemon }} bottom={0} left={0} />
      <Pokemon details={{ ...enemyPokemon }} bottom={0} right={0} />
    </Box>
  );
}
