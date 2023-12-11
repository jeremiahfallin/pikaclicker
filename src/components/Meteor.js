import { Box, Button, Flex } from "@chakra-ui/react";
import useGameStore, { updatePokedex } from "@/hooks/useGameStore";
import { checkEvolve, createPokemon } from "@/utils";

// Gym component manages the gym interactions, including battles and challenges.
export default function Meteor({ meteor, setInMeteor }) {
  const party = useGameStore((state) => state.player.party);
  const updateParty = useGameStore((state) => state.updateParty);
  const background = `${meteor?.type}`;

  // Check if any of the party members can evolve.
  const evolutions = party.map((pokemon) =>
    checkEvolve(pokemon, null, null, null, meteor.type)
  );

  // If any of the party members can evolve, evolve them.
  evolutions.forEach((evolution, idx) => {
    if (evolution) {
      const pokemon = party[idx];
      const evolvedPokemon = createPokemon(
        evolution,
        pokemon.level,
        pokemon.uuid,
        pokemon.isShiny,
        pokemon.pokemonKnockedOut,
        pokemon.bisharpKnockedOut
      );
      const newParty = [...party];
      newParty[idx] = evolvedPokemon;
      updateParty(newParty);
      updatePokedex(evolvedPokemon.id, true);
    }
  });

  // Render the meteor interface with leave button.
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
            setInMeteor(false);
          }}
        >
          Leave
        </Button>
      </Flex>
    </Box>
  );
}
