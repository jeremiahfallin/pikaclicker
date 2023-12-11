import { useState } from "react";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import Gym from "./Gym";
import Elite4 from "./Elite4";
import Meteor from "./Meteor";
import Shop from "./Shop";
import { gyms, elite4 } from "@/constants";
import { meteors } from "@/constants";
import { getHexDetails } from "@/utils";

// Town component represents a town in the game with options to access a Gym and a Shop.
export default function Town() {
  // Retrieves the current location (hex) of the player from the game store.
  const currentHex = useGameStore((state) => state.player.currentHex);

  // State to track if the player is in a Gym.
  const [inGym, setInGym] = useState(false);
  // State to track if the player is in Elite 4.
  const [inElite4, setInElite4] = useState(false);
  // State to track if the player is in a Meteor.
  const [inMeteor, setInMeteor] = useState(false);

  // Hook from Chakra UI to control the opening and closing of the Shop modal.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Background image for the town view.
  const background = "town";

  // Get details of the current town based on the player's hex location.
  const currentTown = getHexDetails(currentHex.q, currentHex.r, currentHex.s);

  // Find the gym associated with the current town.
  const gym = gyms.find((g) => g.town === currentTown.name);
  // Find the meteor associated with the current town.
  const meteor = meteors.find((m) => m.town === currentTown.name);

  // If the player is in the Gym, render the Gym component.
  if (inGym && gym.town === currentTown.name) {
    return <Gym gym={gym} setInGym={setInGym} />;
  }

  // If the player is in Elite 4, render the Elite 4 component.
  if (inElite4) {
    return <Elite4 elite4={elite4} setInElite4={setInElite4} />;
  }

  // If the player is in a Meteor, render the Meteor component.
  if (inMeteor) {
    return <Meteor meteor={meteor} setInMeteor={setInMeteor} />;
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
          {gym && (
            <Button
              size={"sm"}
              colorScheme="green"
              onClick={() => {
                setInGym(true);
              }}
            >
              Gym
            </Button>
          )}
          {elite4.town === currentTown.name && (
            <Button
              size={"sm"}
              colorScheme="green"
              onClick={() => {
                setInElite4(true);
              }}
            >
              Elite Four
            </Button>
          )}
          {/* Button to open the Shop modal. */}
          <Button size={"sm"} colorScheme="green" onClick={onOpen}>
            Shop
          </Button>
        </Flex>
        {meteor && (
          <Flex
            position={"absolute"}
            top={0}
            right={0}
            direction="column"
            gap={2}
          >
            {/* Button to enter the Meteor. Sets inMeteor to true. */}
            <Button
              size={"sm"}
              colorScheme="blue"
              onClick={() => {
                setInMeteor(true);
              }}
            >
              Meteor
            </Button>
          </Flex>
        )}
      </Box>
    </>
  );
}
