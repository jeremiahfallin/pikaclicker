import { useState } from "react";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import Gym from "./Gym";
import Shop from "./Shop";
import { gyms } from "@/constants";
import areas from "../areas";
import { getHexDetails } from "@/utils";

export default function Town() {
  const currentHex = useGameStore((state) => state.player.currentHex);
  const [inGym, setInGym] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const background = "town";

  const currentTown = getHexDetails(currentHex.q, currentHex.r, currentHex.s);
  const gym = gyms.find((g) => g.town === currentTown.name);

  if (inGym) {
    return <Gym gym={gym} setInGym={setInGym} />;
  }
  return (
    <>
      <Shop isOpen={isOpen} onClose={onClose} />
      <Box
        background={`url(backgrounds/${background}.png)`}
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
              setInGym(true);
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
