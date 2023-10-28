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

export default function Battle({ playerPokemon, enemyPokemon, background }) {
  return (
    <Box
      background={`url(backgrounds/${background}.png)`}
      backgroundSize={"100% 100%"}
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
