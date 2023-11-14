import { Center, Image, SimpleGrid, Text } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";

export default function Items({ selectedPokemon }) {
  const items = useGameStore((state) => state.player.items);
  const applyItemOnPokemon = useGameStore((state) => state.applyItemOnPokemon);

  const handleClick = (item) => {
    applyItemOnPokemon(item, selectedPokemon.idx, selectedPokemon.place);
  };

  return (
    <div>
      <div>Items</div>

      <SimpleGrid columns={3} spacing={10}>
        {items.map((item) => {
          return (
            <Center
              key={item.name}
              flexDir={"column"}
              onClick={() => handleClick(item)}
            >
              <Text>{item.name}</Text>
              <Text>{item.quantity}</Text>
            </Center>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
