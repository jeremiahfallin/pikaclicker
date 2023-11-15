import { useState } from "react";
import Head from "next/head";
import { createPokemon, random } from "../utils";
import Bank from "./Bank";
import Party from "./Party";
import Scene from "./Scene";
import Items from "./Items";
import Shop from "./Shop";

import pokes from "../pokes";
import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import Map from "./Map";
import useGameStore, { unlockArea } from "@/hooks/useGameStore";
import Pokedex from "./Pokedex";
import Settings from "./Settings";

const waterStarters = ["squirtle", "totodile", "mudkip", "piplup"];
const grassStarters = ["bulbasaur", "chikorita", "treecko", "sprigatito"];
const fireStarters = ["charmander", "cyndaquil", "fuecoco"];

const starters = [
  waterStarters[random(0, waterStarters.length)],
  grassStarters[random(0, grassStarters.length)],
  fireStarters[random(0, fireStarters.length)],
];

const PickPokemon = ({ starter }) => {
  const updateParty = useGameStore((state) => state.updateParty);
  const starterIndex = pokes.findIndex((val) => val.name === starter);
  const starterDetails = createPokemon(pokes[starterIndex].id, 5);
  return (
    <div
      onClick={() => {
        unlockArea("Area 1");
        updateParty([
          {
            ...starterDetails,
          },
        ]);
      }}
    >
      <span>{starter}</span>
      <Image alt={starter} src={pokes[starterIndex].sprites.front_default} />
    </div>
  );
};

export default function Game() {
  const [selectedPokemon, setSelectedPokemon] = useState({
    idx: null,
    place: null,
  });

  const party = useGameStore((state) => state.player.party);

  return (
    <>
      <Head>
        <title>PikaClicker</title>
        <meta name="description" content="Made with 💓 at BGCUV." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SimpleGrid templateColumns="2fr 3fr 2fr" gap={2} p={2}>
        <Box>
          <Center>
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
          <Settings />
        </Box>
        <Box
          maxH="100vh"
          overflowY="auto"
          scrollBehavior={"smooth"}
          sx={{
            "&::-webkit-scrollbar": { width: "9px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray.400",
              borderRadius: "24px",
              border: "2px solid transparent",
            },
          }}
        >
          <VStack spacing={2} align="stretch">
            <Scene />
            <Map />
          </VStack>
        </Box>
        <Box maxW="100%" w="100%" minW="0">
          <Party
            selectedPokemon={selectedPokemon}
            setSelectedPokemon={setSelectedPokemon}
          />
          <Items selectedPokemon={selectedPokemon} />
          <Bank
            selectedPokemon={selectedPokemon}
            setSelectedPokemon={setSelectedPokemon}
          />
        </Box>
      </SimpleGrid>
    </>
  );
}
