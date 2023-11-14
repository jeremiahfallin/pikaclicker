import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import Shop from "./Shop";

export default function Town() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const background = "town";

  return (
    <>
      <Shop isOpen={isOpen} onClose={onClose} />
      <Box
        background={`url(backgrounds/${background}.png)`}
        backgroundSize={"100% 100%"}
        position={"relative"}
        h={200}
      >
        <Flex position={"absolute"} top={0} left={0} direction="column" gap={2}>
          <Button
            size={"sm"}
            colorScheme="green"
            onClick={() => {
              console.log("moving up");
            }}
          >
            Gym
          </Button>
          <Button size={"sm"} colorScheme="green" onClick={onOpen}>
            Shop
          </Button>
        </Flex>
      </Box>
    </>
  );
}
