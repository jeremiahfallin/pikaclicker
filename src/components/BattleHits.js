import { useCallback, useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";
import { Box } from "@chakra-ui/react";
import { onHit } from "@/game/battleEvents";
import { formatDamage } from "@/utils/display";

// Fast clicking can land many hits a second; only the newest few numbers
// stay on screen.
const MAX_NUMBERS = 8;

const NUMBER_MS = 800;

const floatUp = keyframes`
  0%   { opacity: 0; transform: translate(-50%, 0) scale(0.7); }
  15%  { opacity: 1; transform: translate(-50%, -10px) scale(1.15); }
  30%  { transform: translate(-50%, -16px) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -56px) scale(1); }
`;

// For players who ask their system for less motion: the number fades in
// and out where it is.
const fadeInPlace = keyframes`
  0%   { opacity: 0; transform: translate(-50%, -16px); }
  15%  { opacity: 1; transform: translate(-50%, -16px); }
  100% { opacity: 0; transform: translate(-50%, -16px); }
`;

const prefersLessMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// A quick side-to-side shake with a bright flash, or just the flash for
// players who want less motion.
const shake = [
  { transform: "translateX(0)", filter: "brightness(1)" },
  { transform: "translateX(-6px)", filter: "brightness(2.2)" },
  { transform: "translateX(5px)", filter: "brightness(1.6)" },
  { transform: "translateX(-3px)", filter: "brightness(1.2)" },
  { transform: "translateX(0)", filter: "brightness(1)" },
];
const flash = [
  { filter: "brightness(1)" },
  { filter: "brightness(2.2)" },
  { filter: "brightness(1)" },
];

let nextId = 0;

/**
 * Reacts to hits on one side of the battle: shakes that side's sprite and
 * keeps the list of damage numbers to float over it.
 * @param {"player"|"enemy"} target
 * @returns {{ numbers: Array, removeNumber: (id: number) => void, spriteRef: object }}
 */
export function useHitEffects(target) {
  const [numbers, setNumbers] = useState([]);
  const spriteRef = useRef(null);

  useEffect(
    () =>
      onHit((hit) => {
        if (hit.target !== target) return;
        const number = {
          ...hit,
          id: nextId++,
          // Spread the numbers out a little so quick hits don't stack.
          offset: Math.round((Math.random() - 0.5) * 40),
        };
        setNumbers((list) => [...list.slice(-(MAX_NUMBERS - 1)), number]);
        spriteRef.current?.animate?.(prefersLessMotion() ? flash : shake, {
          duration: 300,
          easing: "ease-out",
        });
      }),
    [target]
  );

  const removeNumber = useCallback((id) => {
    setNumbers((list) => list.filter((n) => n.id !== id));
  }, []);

  return { numbers, removeNumber, spriteRef };
}

/**
 * The damage numbers floating up from one Pokémon. White for hits on the
 * wild Pokémon, red for hits on the player's, gold and bigger for criticals.
 */
export function DamageNumbers({ numbers, onDone }) {
  return numbers.map((n) => (
    <Box
      key={n.id}
      aria-hidden="true"
      position="absolute"
      top="45%"
      left={`calc(50% + ${n.offset}px)`}
      zIndex={2}
      pointerEvents="none"
      whiteSpace="nowrap"
      fontFamily="heading"
      fontWeight={600}
      lineHeight={1}
      fontSize={n.critical ? "3xl" : n.source === "click" ? "lg" : "2xl"}
      color={n.critical ? "gold.300" : n.target === "player" ? "#ff6b5e" : "white"}
      textShadow="0 2px 0 rgba(0,0,0,0.45), 0 0 4px rgba(0,0,0,0.6)"
      animation={`${floatUp} ${NUMBER_MS}ms ease-out forwards`}
      sx={{
        "@media (prefers-reduced-motion: reduce)": {
          animation: `${fadeInPlace} ${NUMBER_MS}ms ease-out forwards`,
        },
      }}
      onAnimationEnd={() => onDone(n.id)}
    >
      {formatDamage(n.damage)}
      {n.critical && "!"}
    </Box>
  ));
}
