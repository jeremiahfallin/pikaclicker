import { Center, Image, SimpleGrid, Text } from "@chakra-ui/react";

export default function Party({ items }) {
  return (
    <div>
      <div>Items</div>

      <SimpleGrid columns={3} spacing={10}>
        {items.map((item) => {
          return (
            <Center key={item.name} flexDir={"column"}>
              <Text>{item.name}</Text>
              <Text>{item.quantity}</Text>
            </Center>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
