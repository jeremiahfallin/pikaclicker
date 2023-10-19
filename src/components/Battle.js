import pokes from "../pokes";
import { Box, Image, Progress } from "@chakra-ui/react";
// battle parts:
/*
Your Pokemon
Enemy Pokemon
How many Pokemon trainer has
Moves
HP Bars (for both)
Levels
Genders
*/

function Pokemon({ details, top, left, bottom, right }) {
  if (!details) return null;
  let sprite = details?.sprites.front_default;
  if (bottom === 0 && left === 0) {
    sprite = details?.sprites.front_default;
  }

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
        value={(100 * details.health) / details.stats[0].base_stat}
        colorScheme="green"
      />
    </Box>
  );
}

export default function Battle({
  playerPokemon,
  enemyPokemon,
  opponentHealth,
}) {
  const myPokemon = pokes.find((val) => val.id === playerPokemon?.id);
  const otherPokemon = pokes.find((val) => val.id === enemyPokemon?.id);
  console.log(otherPokemon);

  return (
    <Box background={"green"} position={"relative"} h={200}>
      {!!myPokemon && (
        <Pokemon
          details={{ ...myPokemon, health: playerPokemon.health }}
          bottom={0}
          left={0}
        />
      )}
      {!!otherPokemon && (
        <Pokemon
          details={{ ...otherPokemon, health: opponentHealth }}
          top={0}
          right={0}
        />
      )}
      <div>Levels</div>
      <div>Genders</div>
    </Box>
  );
}
