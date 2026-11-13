import { useEffect, useRef } from "react";
import { Box, Flex, Image, Progress, Text } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import useBattleClock from "@/hooks/useBattleClock";
import { getTurnProgress } from "@/game/battleClock";
import { homeHex } from "@/utils";
import { formatName, hpColorScheme } from "@/utils/display";
import SceneFrame from "./SceneFrame";
import { DamageNumbers, useHitEffects } from "./BattleHits";

/**
 * One fighter: a name plate (name, level, HP bar) above its sprite, which
 * shakes when hit, with the damage floating up from it.
 * @param {Object} details - The Pokémon: image, name, level and HP.
 * @param {"left"|"right"} side - Which bottom corner of the scene it stands in.
 * @param {"player"|"enemy"} target - Whose Pokémon this is, to pick its hits.
 */
function Pokemon({ details, side, target }) {
  const { numbers, removeNumber, spriteRef } = useHitEffects(target);
  // Return null if no details are provided to prevent rendering errors.
  if (!details) return null;
  const name = formatName(details.name);
  const hp = (100 * details.currentHP) / details.maxHP;

  // The sprite grows with the scene, so a big scene doesn't leave it tiny.
  // Sprites are pixel art, so scale them without blurring.
  return (
    <Flex
      direction="column"
      position="absolute"
      bottom={2}
      {...{ [side]: 2 }}
      w="clamp(120px, 30%, 200px)"
    >
      <Box
        position="relative"
        zIndex={1}
        bg="whiteAlpha.900"
        borderRadius="lg"
        boxShadow="md"
        px={2}
        py={1}
      >
        <Flex justify="space-between" align="baseline" gap={2} fontSize="xs">
          <Text fontWeight={700} noOfLines={1}>
            {name}
          </Text>
          <Text flexShrink={0} color="sky.700" fontWeight={600}>
            Lv {details.level}
          </Text>
        </Flex>
        <Progress
          value={hp}
          size="sm"
          mt={1}
          colorScheme={hpColorScheme(hp)}
          aria-label={`${name} HP`}
        />
      </Box>
      {/* Sprites have empty space at the top; tuck the plate into it so it
          sits just above the Pokémon. */}
      <Box position="relative" mt="-22%">
        <Image
          ref={spriteRef}
          src={details.image}
          alt={name}
          w="100%"
          sx={{ imageRendering: "pixelated" }}
        />
        <DamageNumbers numbers={numbers} onDone={removeNumber} />
      </Box>
    </Flex>
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
    <SceneFrame
      background={background}
      userSelect={"none"}
      onClick={() => handleClick()}
      overflow="hidden"
      id="battle"
    >
      <InitiativeSlider />
      <Pokemon details={playerPokemon} side="left" target="player" />
      <Pokemon details={enemyPokemon} side="right" target="enemy" />
    </SceneFrame>
  );
}
