import { useState } from "react";
import Head from "next/head";
import { createPokemon, random, pokesByName } from "../utils";
import Bank from "./Bank";
import Party from "./Party";
import Scene from "./Scene";
import Items from "./Items";

import { Box, Center, Flex, Grid, Heading, Image } from "@chakra-ui/react";
import Map from "./Map";
import useGameStore, { unlockArea, updatePokedex } from "@/hooks/useGameStore";
import Pokedex from "./Pokedex";
import Settings from "./Settings";
import Badges from "./Badges";
import AwaySummary from "./AwaySummary";

// Initialize starter Pokémon arrays.
const waterStarters = ["squirtle", "totodile", "mudkip", "piplup"];
const grassStarters = ["bulbasaur", "chikorita", "treecko", "sprigatito"];
const fireStarters = ["charmander", "cyndaquil", "fuecoco"];

// Select random starters from each type.
const starters = [
  waterStarters[random(0, waterStarters.length)],
  grassStarters[random(0, grassStarters.length)],
  fireStarters[random(0, fireStarters.length)],
];

// Component for selecting a starter Pokémon.
const PickPokemon = ({ starter }) => {
  const updateParty = useGameStore((state) => state.updateParty);
  const starterData = pokesByName[starter];
  const starterDetails = createPokemon(starterData.name, 5);

  // On click, unlock area and update the party with the selected starter.
  return (
    <div
      onClick={() => {
        unlockArea("Area 1");
        updateParty([{ ...starterDetails }]);
        updatePokedex(starterData.id, true);
      }}
    >
      <span>{starter}</span>
      <Image alt={starter} src={starterData.sprites.front_default} />
    </div>
  );
};

const scrollbar = {
  "&::-webkit-scrollbar": { width: "9px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "gray.400",
    borderRadius: "24px",
    border: "2px solid transparent",
  },
};

// On phones everything is one column. The column boxes below drop out of the
// layout there (display: contents), so their sections can be put in the order
// that matters on a small screen: the battle first, then the party.
const phoneOrder = (n) => ({ base: n, md: 0 });
const column = (display) => ({ base: "contents", md: display });

// Main game component.
export default function Game() {
  // State to track the selected Pokémon.
  const [selectedPokemon, setSelectedPokemon] = useState({
    uuid: null,
    place: null,
  });

  // Retrieve the player's party from the game store.
  const party = useGameStore((state) => state.player.party);

  return (
    <>
      {/* Head component for setting the page title and meta tags. */}
      <Head>
        <title>PikaClicker</title>
        <meta name="description" content="Made with 💓 at BGCUV." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* What the party did while the player was away. */}
      <AwaySummary />

      {/* Layout of the game using a grid. The middle column (the battle and
          the map) gets the most room, and no column can be squeezed to
          nothing by something wide inside another. */}
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(0, 2fr) minmax(0, 4fr) minmax(0, 3fr)",
        }}
        gap={2}
        p={2}
        h={{ md: "100%" }}
      >
        {/* Left column: Pokedex, Badges, Settings */}
        <Flex
          display={column("flex")}
          direction="column"
          gap={2}
          minH="0"
          overflowY="auto"
          sx={scrollbar}
        >
          {/* If the player's party is empty, show starter selection. */}
          {party.length === 0 && (
            <Center order={phoneOrder(0)}>
              <Flex direction={"column"}>
                <Heading as="h2">Choose a starter</Heading>
                <Flex>
                  {starters.map((starter) => {
                    return (
                      <div key={starter}>
                        <PickPokemon starter={starter} />
                      </div>
                    );
                  })}
                </Flex>
              </Flex>
            </Center>
          )}
          <Box order={phoneOrder(6)}>
            <Pokedex />
          </Box>
          <Box order={phoneOrder(7)}>
            <Badges />
          </Box>
          <Box order={phoneOrder(8)}>
            <Settings />
          </Box>
        </Flex>

        {/* Center column: Scene and Map. The scene stays pinned at the top
            while the map scrolls under it. */}
        <Box
          display={column("block")}
          minH="0"
          overflowY="auto"
          scrollBehavior={"smooth"}
          sx={scrollbar}
        >
          <Box
            order={phoneOrder(1)}
            position={{ md: "sticky" }}
            top={0}
            zIndex={1}
          >
            <Scene />
          </Box>
          <Box order={phoneOrder(4)}>
            <Map />
          </Box>
        </Box>

        {/* Right column: Party, Items, Bank. The bank fills what's left and
            scrolls. On short screens the bank keeps a usable height and the
            whole column scrolls instead. */}
        <Flex
          display={column("flex")}
          direction="column"
          gap={2}
          minH="0"
          overflowY="auto"
          sx={scrollbar}
        >
          <Box order={phoneOrder(2)} flexShrink={0}>
            <Party
              selectedPokemon={selectedPokemon}
              setSelectedPokemon={setSelectedPokemon}
            />
          </Box>
          <Box order={phoneOrder(3)} flexShrink={0} minW="0">
            <Items selectedPokemon={selectedPokemon} />
          </Box>
          <Flex
            order={phoneOrder(5)}
            direction="column"
            flex={{ md: "1" }}
            minH={{ md: "240px" }}
          >
            <Bank
              selectedPokemon={selectedPokemon}
              setSelectedPokemon={setSelectedPokemon}
            />
          </Flex>
        </Flex>
      </Grid>
    </>
  );
}
