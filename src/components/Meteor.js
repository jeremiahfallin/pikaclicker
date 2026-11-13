import { useEffect } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import useGameStore, { updatePokedex } from "@/hooks/useGameStore";
import { checkEvolve, createPokemon } from "@/utils";

// Meteor component: party members that change form at this meteor (Deoxys)
// change when the player enters.
export default function Meteor({ meteor, setInMeteor }) {
  const party = useGameStore((state) => state.player.party);
  const updateParty = useGameStore((state) => state.updateParty);
  const background = `${meteor?.type}`;

  // Evolve in an effect, not during render, and build the whole new party in
  // one pass so every evolving member is kept.
  useEffect(() => {
    let changed = false;
    const newParty = party.map((pokemon) => {
      const evolution = checkEvolve(pokemon, null, null, null, meteor.type);
      if (!evolution) return pokemon;

      changed = true;
      const evolvedPokemon = createPokemon(
        evolution,
        pokemon.level,
        pokemon.uuid,
        pokemon.isShiny,
        pokemon.pokemonKnockedOut,
        pokemon.bisharpKnockedOut,
        pokemon.gender,
        pokemon.happiness,
        pokemon.affection
      );
      updatePokedex(evolvedPokemon.id, true);
      // Keep progress toward the next level; createPokemon would reset it.
      return { ...pokemon, ...evolvedPokemon, xp: pokemon.xp };
    });

    if (changed) {
      updateParty(newParty);
    }
  }, [party, meteor.type, updateParty]);

  // Render the meteor interface with leave button.
  return (
    <Box
      background={`url(backgrounds/${background}.webp)`}
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
