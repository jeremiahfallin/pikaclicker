import { useState } from "react";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import Gym from "./Gym";
import Shop from "./Shop";
import { gyms } from "@/constants";
import { getHexDetails } from "@/utils";

// Town component represents a town in the game with options to access a Gym and a Shop.
export default function Town() {
  // Retrieves the current location (hex) of the player from the game store.
  const currentHex = useGameStore((state) => state.player.currentHex);

  // State to track if the player is in a Gym.
  const [inGym, setInGym] = useState(false);

  // Hook from Chakra UI to control the opening and closing of the Shop modal.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Background image for the town view.
  const background = "town";

  // Get details of the current town based on the player's hex location.
  const currentTown = getHexDetails(currentHex.q, currentHex.r, currentHex.s);

  // Find the gym associated with the current town.
  const gym = gyms.find((g) => g.town === currentTown.name);

  // If the player is in the Gym, render the Gym component.
  if (inGym) {
    return <Gym gym={gym} setInGym={setInGym} />;
  }

  // Render the main town view with options to go to the Gym or the Shop.
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
          {/* Button to enter the Gym. Sets inGym to true. */}
          <Button
            size={"sm"}
            colorScheme="green"
            onClick={() => {
              setInGym(true);
            }}
          >
            Gym
          </Button>
          {/* Button to open the Shop modal. */}
          <Button size={"sm"} colorScheme="green" onClick={onOpen}>
            Shop
          </Button>
        </Flex>
      </Box>
    </>
  );
}
