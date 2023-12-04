import { useState } from "react";
import Head from "next/head";
import { createPokemon, random } from "../utils";
import Bank from "./Bank";
import Party from "./Party";
import Scene from "./Scene";
import Items from "./Items";

import pokes from "../pokes";
import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import Map from "./Map";
import useGameStore, { unlockArea, updatePokedex } from "@/hooks/useGameStore";
import Pokedex from "./Pokedex";
import Settings from "./Settings";
import Badges from "./Badges";

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
  const starterIndex = pokes.findIndex((val) => val.name === starter);
  const starterDetails = createPokemon(pokes[starterIndex].id, 5);

  // On click, unlock area and update the party with the selected starter.
  return (
    <div
      onClick={() => {
        unlockArea("Area 1");
        updateParty([{ ...starterDetails }]);
        updatePokedex(pokes[starterIndex].id, true);
      }}
    >
      <span>{starter}</span>
      <Image alt={starter} src={pokes[starterIndex].sprites.front_default} />
    </div>
  );
};

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

      {/* Layout of the game using a grid. */}
      <SimpleGrid
        templateColumns={{ sm: "1fr", md: "2fr 4fr 3fr" }}
        gap={2}
        p={2}
      >
        {/* Left column: Pokedex, Badges, Settings */}
        <Box>
          <Center>
            {/* If the player's party is empty, show starter selection. */}
            {party.length === 0 && (
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
            )}
          </Center>
          <Pokedex />
          <Badges />
          <Settings />
        </Box>
        {/* Center column: Scene and Map */}
        <Grid
          gridTemplateRows="auto 1fr"
          maxW="100%"
          w="100%"
          minW="0"
          overflowY="auto"
          maxH={"100vh"}
          scrollBehavior={"smooth"}
          sx={{
            "&::-webkit-scrollbar": { width: "9px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray.700",
              borderRadius: "24px",
              border: "2px solid transparent",
            },
          }}
        >
          <Scene />
          <Map />
        </Grid>

        {/* Right column: Party, Items, Bank */}
        <Grid
          gridTemplateRows="auto auto 1fr"
          maxW="100%"
          w="100%"
          minW="0"
          maxH="100vh"
          overflowY="auto"
          scrollBehavior={"smooth"}
          sx={{
            "&::-webkit-scrollbar": { width: "9px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray.700",
              borderRadius: "24px",
              border: "2px solid transparent",
            },
          }}
        >
          <Party
            selectedPokemon={selectedPokemon}
            setSelectedPokemon={setSelectedPokemon}
          />
          <Items selectedPokemon={selectedPokemon} />
          <Bank
            selectedPokemon={selectedPokemon}
            setSelectedPokemon={setSelectedPokemon}
          />
        </Grid>
      </SimpleGrid>
    </>
  );
}
