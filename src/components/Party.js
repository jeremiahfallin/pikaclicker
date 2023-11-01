import { Center, Image, SimpleGrid, Text } from "@chakra-ui/react";
import pokes from "../pokes";

const findIndex = (id) => pokes.findIndex((val) => val.id === id);

export default function Party({ party }) {
  return (
    <div>
      <div>Party</div>

      <SimpleGrid columns={3} spacing={10}>
        {party.map((pokemon, idx) => {
          return (
            <Center key={`${pokemon.id}-${idx}`} flexDir={"column"}>
              <Image alt={pokemon.name} src={pokemon.image} />
              <Text>{pokemon.name}</Text>
              <Text>
                Lvl. {pokemon.level} {pokemon.xp} xp
              </Text>
            </Center>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
