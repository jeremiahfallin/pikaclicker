import { useState } from "react";
import { HexGrid, Layout, Hexagon, Pattern } from "react-hexgrid";

import areas from "../areas";
import axial from "../map_axial";
import hex from "../hex";
import { getHexDetails } from "@/utils";

const tileImages = {};
hex.tiles.forEach((tile) => {
  tileImages[tile.id] = tile.image;
});

export default function Map({ player, updateCurrentHex, startBattle }) {
  const [areaHexes, setAreaHexes] = useState([]);
  return (
    <HexGrid
      width={"100%"}
      height={"auto"}
      viewBox="-5 20 160 240"
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
                setAreaHexes((prev) => {
                  if (
                    prev.find(
                      (val) => val.q === q && val.r === r && val.s === s
                    ) !== undefined
                  ) {
                    return prev;
                  }

                  return [...prev, { q, r, s }];
                });
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
                  const hexDetails = getHexDetails(q, r, s);
                  const isTown = hexDetails.isTown;
                  updateCurrentHex({ q, r, s, isTown });
                }
                console.log(areaHexes);
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
  );
}
