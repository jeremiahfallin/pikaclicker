import { Center, Image, SimpleGrid, Text } from "@chakra-ui/react";
import pokes from "../pokes";

const findIndex = (id) => pokes.findIndex((val) => val.id === id);

export default function Party({ party }) {
  return (
    <div>
      <div>Party</div>

      <SimpleGrid columns={3} spacing={10}>
        {party.map((pokemon) => {
          return (
            <Center key={pokemon.id} flexDir={"column"}>
              <Image alt={pokemon.name} src={pokemon.image} />
              <Text>{pokemon.name}</Text>
              <Text>Lvl. {pokemon.level}</Text>
            </Center>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
