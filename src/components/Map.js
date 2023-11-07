import { memo, useCallback } from "react";
import { HexGrid, Layout, Hexagon, Pattern } from "react-hexgrid";

import areas from "../areas";
import axial from "../map_axial";
import hex from "../hex";
import { getHexDetails } from "@/utils";

const tileImages = {};
hex.tiles.forEach((tile) => {
  tileImages[tile.id] = tile.image;
});

const HexagonMemo = memo(Hexagon);

export default function Map({ unlockedAreas, currentHex, updateCurrentHex }) {
  const onHexClick = useCallback(
    (hex) => {
      console.log(hex);
      let hexArea =
        areas.find((area) =>
          area.hexes.some(
            (h) => h.q === hex.q && h.r === hex.r && h.s === hex.s
          )
        )?.name || "";
      if (unlockedAreas.has(hexArea)) {
        const hexDetails = getHexDetails(hex.q, hex.r, hex.s);
        updateCurrentHex({ ...hex, isTown: hexDetails.isTown });
      }
    },
    [unlockedAreas, updateCurrentHex]
  );

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

          if (currentHex.q === q && currentHex.r === r && currentHex.s === s) {
            cellStyle = {
              ...cellStyle,
              stroke: "red",
              strokeWidth: ".25px",
              strokeDasharray: "2,2",
              strokeLinejoin: "round",
            };
          }

          return (
            <HexagonMemo
              key={idx}
              q={hex.q}
              r={hex.r}
              s={hex.q - hex.r}
              fill={fill}
              cellStyle={cellStyle}
              value={hex}
              onClick={onHexClick}
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
