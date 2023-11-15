import { memo, useCallback, useMemo, useEffect } from "react";
import { HexGrid, Layout, Hexagon, Pattern } from "react-hexgrid";
import useGameStore from "@/hooks/useGameStore";
import { useShallow } from "zustand/react/shallow";

import axial from "../map_axial";
import hex from "../hex";

const hexIds = new Set();
axial.forEach((hex) => {
  const fill =
    parseInt(hex.id) < -1 ? parseInt(hex.id) + 2147483648 : parseInt(hex.id);
  hexIds.add(fill);
});

const tileImages = {};
hex.tiles.forEach((tile) => {
  const fill =
    parseInt(tile.id) < -1 ? parseInt(tile.id) + 2147483648 : parseInt(tile.id);
  if (hexIds.has(fill)) {
    tileImages[tile.id] = tile.image;
  }
});

const HexagonMemo = memo(Hexagon);

const HexagonContainer = ({ q, r, s, hexId, fill, isSelected }) => {
  const updateCurrentHex = useGameStore((state) => state.updateCurrentHex);
  const onClick = useCallback(() => {
    updateCurrentHex({ q, r, s });
  }, [q, r, s, updateCurrentHex]);

  const cellStyle = useMemo(() => {
    let style = {};
    if (hexId < -1) {
      style = { transform: "scaleX(-1)" };
    }
    if (isSelected) {
      style = {
        ...style,
        stroke: "red",
        strokeWidth: ".25px",
        strokeDasharray: "2,2",
        strokeLinejoin: "round",
      };
    }
    return style;
  }, [hexId, isSelected]);

  return (
    <HexagonMemo
      q={q}
      r={r}
      s={s}
      fill={fill}
      cellStyle={cellStyle}
      onClick={onClick}
    />
  );
};

const HexagonContainerMemo = memo(HexagonContainer);

function Map() {
  const currentHex = useGameStore(
    useShallow((state) => state.player.currentHex)
  );

  return (
    <HexGrid
      width={"100%"}
      height={"auto"}
      viewBox="-5 -5 160 190"
      preserveAspectRatio="xMidYMid meet"
    >
      <Layout size={{ x: 4, y: 4 }} flat={true} spacing={0.85}>
        {axial.map((hex, idx) => {
          if (hex.id === 0 || hex.id === -1) {
            return null;
          }
          let fill = hex.id < -1 ? parseInt(hex.id) + 2147483648 : hex.id;

          const q = hex.q;
          const r = hex.r;
          const s = hex.q - hex.r;

          const isSelected =
            currentHex.q === q && currentHex.r === r && currentHex.s === s;

          return (
            <HexagonContainerMemo
              key={idx}
              q={hex.q}
              r={hex.r}
              s={hex.q - hex.r}
              fill={fill}
              hexId={hex.id}
              isSelected={isSelected}
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

export default memo(Map);
