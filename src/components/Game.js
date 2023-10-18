import { useEffect, useState } from "react";
import Head from "next/head";
import { HexGrid, Layout, Hexagon, Pattern } from "react-hexgrid";
import { Pokedex } from "pokeapi-js-wrapper";
import usePlayer from "../hooks/usePlayer";
import useStickyState from "../hooks/useStickyState";
import { random } from "../utils";
import AddPokemonToMap from "./AddPokemonToMap";
import Party from "./Party";
import Battle from "./Battle";

import areas from "../areas";
import hex from "../hex";
import axial from "../map_axial";
import pokes from "../pokes";
import locations from "../locations";

const p = new Pokedex();

const tileImages = {};
hex.tiles.forEach((tile) => {
  tileImages[tile.id] = tile.image;
});

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

  return (
    <div
      onClick={() =>
        updateParty([{ id: pokes[starterIndex].id, lvl: 5, xp: 0 }])
      }
    >
      <span>{starter}</span>
      <img alt={starter} src={pokes[starterIndex].image} />
    </div>
  );
};

export default function Game() {
  const { player, updateCurrentHex, updateParty, updateBank, updatePokedex } =
    usePlayer();

  return (
    <>
      <Head>
        <title>PikaClicker</title>
        <meta name="description" content="Made with 💓 at BGCUV." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <pre>{JSON.stringify(player, null, 2)}</pre>
          <Battle
            playerPokemon={player.party[0]}
            enemyPokemon={player.enemyPokemon}
          />
          {player.party.length === 0 && (
            <div>
              {starters.map((starter) => {
                return (
                  <div key={starter}>
                    <PickPokemon starter={starter} updateParty={updateParty} />
                  </div>
                );
              })}
            </div>
          )}
          {JSON.stringify(player.partyPokemon, null, 2)}
          <HexGrid
            width={720}
            height={800}
            viewBox="15 -5 150 215"
            preserveAspectRatio="xMidYMid meet"
          >
            <Layout size={{ x: 4, y: 4 }} flat={true} spacing={0.85}>
              {axial.map((hex, idx) => {
                if (hex.id === 0 || hex.id === -1) {
                  return null;
                }
                let cellStyle = {};
                let fill = hex.id;

                if (hex.id < -1) {
                  fill = parseInt(hex.id) + 2147483648;
                  cellStyle = { transform: "scaleX(-1)" };
                }

                const q = hex.q;
                const r = hex.r;
                const s = hex.q - hex.r;

                if (
                  player.currentHex.q === q &&
                  player.currentHex.r === r &&
                  player.currentHex.s === s
                ) {
                  cellStyle = {
                    ...cellStyle,
                    stroke: "red",
                    strokeWidth: ".25px",
                    strokeDasharray: "2,2",
                    strokeLinejoin: "round",
                  };
                }

                return (
                  <Hexagon
                    key={idx}
                    q={hex.q}
                    r={hex.r}
                    s={hex.q - hex.r}
                    fill={fill}
                    cellStyle={cellStyle}
                    onClick={() => {
                      let hexArea = "";
                      for (let area of areas) {
                        const areaIndex = area.hexes.findIndex(
                          (h) => h.q === q && h.r === r && h.s === s
                        );
                        if (areaIndex >= 0) {
                          hexArea = area.name;
                        }
                      }
                      if (player.unlockedAreas.includes(hexArea)) {
                        updateCurrentHex({ q, r, s });
                      }
                    }}
                  />
                );
              })}
            </Layout>
            {Object.keys(tileImages).map((id) => {
              return (
                <Pattern
                  key={id}
                  id={id}
                  link={tileImages[id]}
                  size={{ x: 4, y: 4 }}
                />
              );
            })}
          </HexGrid>
        </div>

        <Party party={player.party} />
        {/* <AddPokemonToMap
          pokes={pokes}
          selectedPokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
          pokemonData={pokemonData}
        /> */}
      </main>
    </>
  );
}
