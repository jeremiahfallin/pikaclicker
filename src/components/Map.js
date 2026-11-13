import { memo, useCallback, useMemo } from "react";
import { HexGrid, Layout, Hexagon, Pattern } from "react-hexgrid";
import { keyframes } from "@emotion/react";
import { Box, Flex, useToast } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import { useShallow } from "zustand/react/shallow";
import { areaNameAt, areasAt } from "@/utils";
import { areaLabel } from "@/utils/display";

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

// What a hex is called on the map: the area and the levels of the wild
// Pokémon there. A hex on the border of two areas spawns at the levels of
// the last one listing it (see getHexDetails), so that one names it.
const labelAt = (q, r) => areaLabel(areasAt(q, r).at(-1));

// The hexes to draw, worked out once. Ids 0 and -1 are empty space.
const cells = axial.flatMap((hex, idx) => {
  if (hex.id === 0 || hex.id === -1) return [];
  return [
    {
      key: idx,
      q: hex.q,
      r: hex.r,
      s: -hex.q - hex.r,
      hexId: hex.id,
      fill: hex.id < -1 ? parseInt(hex.id) + 2147483648 : hex.id,
      label: labelAt(hex.q, hex.r),
      // Whether the player can go here depends on this area.
      lockArea: areaNameAt(hex.q, hex.r),
    },
  ];
});

const HexagonMemo = memo(Hexagon);

const LOCKED_TOAST = "area-locked";

const HexagonContainer = ({ q, r, s, hexId, fill, isLocked, label }) => {
  const toast = useToast();
  const updateCurrentHex = useGameStore((state) => state.updateCurrentHex);
  const onClick = useCallback(() => {
    if (isLocked) {
      // One message at a time, however often a locked hex is clicked.
      if (!toast.isActive(LOCKED_TOAST)) {
        toast({
          id: LOCKED_TOAST,
          title: "Area locked.",
          description: "You have not unlocked this area yet.",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
      }
      return;
    }
    updateCurrentHex({ q, r });
  }, [q, r, isLocked, toast, updateCurrentHex]);

  // Locked areas are faded, like places not explored yet.
  const cellStyle = useMemo(
    () => ({
      ...(hexId < -1 && { transform: "scaleX(-1)" }),
      ...(isLocked && { opacity: 0.35 }),
    }),
    [hexId, isLocked]
  );

  return (
    <HexagonMemo
      q={q}
      r={r}
      s={s}
      fill={fill}
      cellStyle={cellStyle}
      onClick={onClick}
    >
      {/* Shown when hovering over the hex. */}
      <title>{isLocked ? `${label} · Locked` : label}</title>
    </HexagonMemo>
  );
};

const HexagonContainerMemo = memo(HexagonContainer);

// The marker on the player's hex: a white edge under a gold one, so it shows
// up on any tile. It doesn't block clicks on the hexes around it.
const markerEdge = {
  fill: "none",
  stroke: "white",
  strokeWidth: 1.4,
  strokeLinejoin: "round",
  pointerEvents: "none",
};
const markerLine = {
  ...markerEdge,
  stroke: "#ffd23f",
  strokeWidth: 0.7,
};

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const mapStyles = {
  "& .current-hex": { animation: `${pulse} 1.6s ease-in-out infinite` },
  "@media (prefers-reduced-motion: reduce)": {
    "& .current-hex": { animation: "none" },
  },
};

const pill = {
  bg: "whiteAlpha.900",
  borderRadius: "full",
  boxShadow: "sm",
  px: 3,
  py: 0.5,
  whiteSpace: "nowrap",
};

function Map() {
  const currentHex = useGameStore(
    useShallow((state) => state.player.currentHex)
  );
  const unlockedAreas = useGameStore((state) => state.player.unlockedAreas);
  const { q, r } = currentHex;

  return (
    <Box position="relative" sx={mapStyles}>
      <Flex
        position="absolute"
        top={2}
        left={2}
        right={2}
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={2}
        zIndex={1}
        pointerEvents="none"
      >
        <Box {...pill} fontSize="sm" fontWeight={700}>
          Here: {labelAt(q, r)}
        </Box>
        <Box {...pill} fontSize="xs" color="sky.700">
          Faded areas are locked
        </Box>
      </Flex>
      <HexGrid
        width={"100%"}
        height={"auto"}
        viewBox="-5 -5 160 190"
        preserveAspectRatio="xMidYMid meet"
      >
        <Layout size={{ x: 4, y: 4 }} flat={true} spacing={0.85}>
          {cells.map((cell) => (
            <HexagonContainerMemo
              key={cell.key}
              q={cell.q}
              r={cell.r}
              s={cell.s}
              fill={cell.fill}
              hexId={cell.hexId}
              isLocked={!unlockedAreas.has(cell.lockArea)}
              label={cell.label}
            />
          ))}
          {/* Drawn last, so it sits on top of the hexes around it. */}
          <Hexagon
            q={q}
            r={r}
            s={-q - r}
            className="current-hex"
            cellStyle={markerEdge}
          />
          <Hexagon
            q={q}
            r={r}
            s={-q - r}
            className="current-hex"
            cellStyle={markerLine}
          />
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
    </Box>
  );
}

export default memo(Map);
