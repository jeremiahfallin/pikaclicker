import { Center, Image, SimpleGrid, Text } from "@chakra-ui/react";
import pokes from "../pokes";

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
                Lvl. {pokemon.level} {Math.floor(pokemon.xp)} xp
              </Text>
              <Text>HP: {Math.floor(pokemon.currentHP)}</Text>
            </Center>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
