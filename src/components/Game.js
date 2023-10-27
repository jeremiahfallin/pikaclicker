import Head from "next/head";
import { Pokedex } from "pokeapi-js-wrapper";
import { createPokemon, random } from "../utils";
import AddPokemonToMap from "./AddPokemonToMap";
import Party from "./Party";
import Battle from "./Battle";

import pokes from "../pokes";
import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import Map from "./Map";
import { useGameSession } from "@/hooks/useGameSession";

const p = new Pokedex();

const waterStarters = ["squirtle", "totodile", "mudkip", "piplup"];
const grassStarters = ["bulbasaur", "chikorita", "treecko", "sprigatito"];
const fireStarters = ["charmander", "cyndaquil", "fuecoco"];

const starters = [
  waterStarters[random(0, waterStarters.length)],
  grassStarters[random(0, grassStarters.length)],
  fireStarters[random(0, fireStarters.length)],
];

const PickPokemon = ({ starter, updateParty }) => {
  const starterIndex = pokes.findIndex((val) => val.name === starter);
  const starterDetails = createPokemon(pokes[starterIndex].id, 5);
  return (
    <div
      onClick={() => {
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
  const {
    game,
    startBattle,
    player,
    updateCurrentHex,
    updateParty,
    updateBank,
    updatePokedex,
  } = useGameSession();

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
          <pre>{JSON.stringify(player, null, 2)}</pre>
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
                          startBattle={startBattle}
                        />
                      </div>
                    );
                  })}
                </Flex>
              </Flex>
            )}
          </Center>
          {JSON.stringify(player.partyPokemon, null, 2)}
        </Box>
        <Box>
          <Battle
            playerPokemon={player.party[0]}
            enemyPokemon={game.battle.pokemon}
          />
          <Map
            player={player}
            updateCurrentHex={updateCurrentHex}
            startBattle={startBattle}
          />
        </Box>
        <Box>
          <Party party={player.party} />
        </Box>
      </SimpleGrid>
    </>
  );
}
