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
  console.log(details);
  return (
    <Box
      position="absolute"
      top={top}
      right={right}
      left={left}
      bottom={bottom}
    >
      <Image src={details?.image} alt={details?.name} />
      <Progress value={100} colorScheme="green" />
    </Box>
  );
}

export default function Battle({ playerPokemon, enemyPokemon }) {
  const myPokemon = pokes.find((val) => val.id === playerPokemon?.id);
  const otherPokemon = pokes.find((val) => val.id === enemyPokemon?.id);
  return (
    <div style={{ background: "green", position: "relative" }}>
      <Pokemon details={myPokemon} bottom={0} left={0} />
      <Pokemon details={otherPokemon} top={0} right={0} />
      <pre>{JSON.stringify(playerPokemon, null, 2)}</pre>
      <pre>{JSON.stringify(enemyPokemon, null, 2)}</pre>
      <div>Moves</div>
      <div>Levels</div>
      <div>Genders</div>
    </div>
  );
}
