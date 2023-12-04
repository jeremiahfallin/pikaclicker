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
import { shops } from "@/constants";
import { getHexDetails } from "@/utils";

export default function Shop({ isOpen, onClose }) {
  const coins = useGameStore((state) => state.player.coins);
  const playerItems = useGameStore((state) => state.player.items);
  const updateItems = useGameStore((state) => state.updateItems);
  const updateCoins = useGameStore((state) => state.updateCoins);
  const clickMultiplier = useGameStore((state) => state.clickMultiplier);
  const updateClickMultiplier = useGameStore(
    (state) => state.updateClickMultiplier
  );
  const currentHex = useGameStore((state) => state.player.currentHex);
  const currentTown = getHexDetails(currentHex.q, currentHex.r);
  console.log(currentTown);
  const shopItems = shops.find((shop) => shop.town === currentTown.name).items;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Shop</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="row" gap={8} wrap="wrap">
            <Box>
              <Heading as="h3" size="sm">
                Click Multiplier
              </Heading>
              <Text>Current: {clickMultiplier}</Text>
              <Text>
                Cost: {Math.floor(200 * Math.pow(1.5, clickMultiplier))}
              </Text>
              <Button
                size="sm"
                onClick={() => {
                  if (
                    coins >= Math.floor(200 * Math.pow(1.5, clickMultiplier))
                  ) {
                    updateCoins(
                      coins - Math.floor(200 * Math.pow(1.5, clickMultiplier))
                    );
                    updateClickMultiplier(clickMultiplier + 1);
                  }
                }}
              >
                Buy
              </Button>
            </Box>
            {shopItems.map((item, idx) => {
              return (
                <Box key={`${item.name}-${idx}`}>
                  <Heading as="h3" size="sm">
                    {item.name}
                  </Heading>
                  <Text>{item.description}</Text>
                  <Text>Cost: {item.price}</Text>
                  <Button
                    size="sm"
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
