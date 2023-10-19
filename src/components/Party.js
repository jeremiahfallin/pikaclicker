import { Center, Image, Text } from "@chakra-ui/react";
import pokes from "../pokes";

const findIndex = (id) => pokes.findIndex((val) => val.id === id);

export default function Party({ party }) {
  return (
    <div>
      <div>Party</div>

      {party.map((pokemon) => {
        const details = findIndex(pokemon.id);
        return (
          <Center key={pokemon.id} flexDir={"column"}>
            <Image
              alt={pokes[details].name}
              src={pokes[details].sprites.front_default}
            />
            <Text>{pokes[details].name}</Text>
          </Center>
        );
      })}
    </div>
  );
}
