import { useState } from "react";
import Head from "next/head";
import { createPokemon, random } from "../utils";
import Bank from "./Bank";
import Party from "./Party";
import Battle from "./Battle";
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
  useInterval,
} from "@chakra-ui/react";
import Map from "./Map";
import useGameStore, { unlockArea } from "@/hooks/useGameStore";

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
  const battle = useGameStore((state) => state.battle);
  const handleTurn = useGameStore((state) => state.handleTurn);
  const player = useGameStore((state) => state.player);
  const updateCurrentHex = useGameStore((state) => state.updateCurrentHex);
  const updateParty = useGameStore((state) => state.updateParty);
  const updateItems = useGameStore((state) => state.updateItems);
  const updateCoins = useGameStore((state) => state.updateCoins);
  const releasePokemon = useGameStore((state) => state.releasePokemon);
  const unlockArea = useGameStore((state) => state.unlockArea);
  const party = useGameStore((state) => state.player.party);

  const averageSpeed =
    party.reduce((acc, curr) => {
      return acc + curr.speed;
    }, 0) / party.length;

  console.log(averageSpeed);

  useInterval(() => {
    handleTurn();
  }, 1000 * (100 / averageSpeed));

  return (
    <>
      <Head>
        <title>PikaClicker</title>
        <meta name="description" content="Made with 💓 at BGCUV." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SimpleGrid columns={3}>
        <Box>
          <Center>
            {player.party.length === 0 && (
              <Flex direction={"column"}>
                <Heading as="h2">Choose a starter</Heading>
                <Flex>
                  {starters.map((starter) => {
                    return (
                      <div key={starter}>
                        <PickPokemon
                          starter={starter}
                          updateParty={updateParty}
                          unlockArea={unlockArea}
                        />
                      </div>
                    );
                  })}
                </Flex>
              </Flex>
            )}
          </Center>
          <Shop
            playerItems={player.items}
            updateItems={updateItems}
            coins={player.coins}
            updateCoins={updateCoins}
          />
        </Box>
        <Box>
          <Battle
            playerPokemon={player.party[0]}
            enemyPokemon={battle.pokemon}
            background={"forest"}
          />
          <Map
            unlockedAreas={player.unlockedAreas}
            currentHex={player.currentHex}
            updateCurrentHex={updateCurrentHex}
          />
        </Box>
        <Box>
          <Party
            party={player.party}
            selectedPokemon={selectedPokemon}
            setSelectedPokemon={setSelectedPokemon}
          />
          <Items items={player.items} />
          <Bank
            bank={player.bank}
            selectedPokemon={selectedPokemon}
            setSelectedPokemon={setSelectedPokemon}
            releasePokemon={releasePokemon}
          />
        </Box>
      </SimpleGrid>
    </>
  );
}
