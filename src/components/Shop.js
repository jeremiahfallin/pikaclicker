import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";

const shopItems = [
  {
    name: "Pokeball",
    price: 100,
    type: "ball",
  },
  {
    name: "Great Ball",
    price: 200,
    type: "ball",
  },
  {
    name: "Ultra Ball",
    price: 1000,
    type: "ball",
  },
  {
    name: "Fire Stone",
    slug: "fire-stone",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Moon Stone",
    slug: "moon-stone",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Ice Stone",
    slug: "ice-stone",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Water Stone",
    slug: "water-stone",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Dusk Stone",
    slug: "dusk-stone",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Sun Stone",
    slug: "sun-stone",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Thunder Stone",
    slug: "thunder-stone",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Protector",
    slug: "protector",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Auspicious Armor",
    slug: "auspicious-armor",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Malicious Armor",
    slug: "malicious-armor",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Link Cable",
    slug: "link-cable",
    price: 10000,
    type: "evolution-item",
  },
  {
    name: "Shiny Stone",
    slug: "shiny-stone",
    price: 50000,
    type: "evolution-item",
  },
];

// TODO: Move items and sell different items in different towns

export default function Shop({ isOpen, onClose }) {
  const coins = useGameStore((state) => state.player.coins);
  const playerItems = useGameStore((state) => state.player.items);
  const updateItems = useGameStore((state) => state.updateItems);
  const updateCoins = useGameStore((state) => state.updateCoins);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Shop</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="row" gap={8} wrap="wrap">
            {shopItems.map((item, idx) => {
              return (
                <Box key={`${item.name}-${idx}`}>
                  <Heading as="h3" size="sm">
                    {item.name}
                  </Heading>
                  <Text>{item.description}</Text>
                  <Text>Cost: {item.price}</Text>
                  <Button
                    onClick={() => {
                      if (coins >= item.price) {
                        updateCoins(coins - item.price);
                        const itemIndex = playerItems.findIndex(
                          (i) => i.name === item.name
                        );
                        if (itemIndex !== -1) {
                          const newItems = [...playerItems];
                          newItems[itemIndex].quantity += 1;
                          updateItems(newItems);
                        } else {
                          updateItems([
                            ...playerItems,
                            { ...item, quantity: 1 },
                          ]);
                        }
                      }
                    }}
                  >
                    Buy
                  </Button>
                </Box>
              );
            })}
          </Flex>
        </ModalBody>
        <ModalFooter>Coins: {coins}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
