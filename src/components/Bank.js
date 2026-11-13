import { useState, useRef } from "react";
import {
  Box,
  Button,
  Image,
  Input,
  RadioGroup,
  Radio,
  Text,
  Stack,
  Flex,
  Checkbox,
} from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import { formatName } from "@/utils/display";
import { scrollbar } from "@/theme";
import { panelStyle, PanelTitle } from "./Panel";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  fastGrowth,
  slowGrowth,
  erraticGrowth,
  mediumFastGrowth,
  mediumSlowGrowth,
  fluctuatingGrowth,
} from "@/utils";

const levelFormulas = {
  erratic: erraticGrowth,
  fast: fastGrowth,
  "medium-fast": mediumFastGrowth,
  medium: mediumFastGrowth,
  "medium-slow": mediumSlowGrowth,
  slow: slowGrowth,
  fluctuating: fluctuatingGrowth,
  "slow-then-very-fast": fluctuatingGrowth,
};

export default function Bank({ selectedPokemon, setSelectedPokemon }) {
  const parentRef = useRef(null);
  const [sortBy, setSortBy] = useState("id");
  const [isShiny, setIsShiny] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [release, setRelease] = useState(null);
  const swapPokemon = useGameStore((state) => state.swapPokemon);
  const bank = useGameStore((state) => state.player.bank);
  const releasePokemon = useGameStore((state) => state.releasePokemon);
  const setPokemon = (uuid) => {
    setSelectedPokemon((prev) => {
      if (prev.uuid === null) {
        return {
          uuid: uuid,
          place: "bank",
        };
      } else if (prev.uuid === uuid && prev.place === "bank") {
        return {
          uuid: null,
          place: null,
        };
      } else {
        swapPokemon(uuid, "bank", selectedPokemon.uuid, selectedPokemon.place);
        return {
          uuid: null,
          place: null,
        };
      }
    });
  };

  const pokemonBank = bank
    .sort((a, b) => {
      switch (sortBy) {
        case "id":
          return a.id - b.id;
        case "level":
          return b.level - a.level;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return a.id - b.id;
      }
    })
    // Match what players see ("Alolan Raichu") as well as the data name,
    // whatever the capitals.
    .filter((poke) => {
      const term = searchTerm.trim().toLowerCase();
      return (
        !term ||
        poke.name.includes(term) ||
        formatName(poke.name).toLowerCase().includes(term)
      );
    })
    .filter((poke) => {
      if (isShiny) {
        return poke.isShiny;
      } else {
        return true;
      }
    });

  const rowVirtualizer = useVirtualizer({
    count: pokemonBank.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 84,
    overscan: 5,
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // The whole panel is the scroll area (the list is virtualized against it),
  // with the heading and filters pinned at the top.
  return (
    <Box
      {...panelStyle}
      w="100%"
      flex={{ md: "1" }}
      minH="0"
      // On phones the bank sits in the page, so it needs its own height
      // to scroll in.
      maxH={{ base: "70vh", md: "none" }}
      overflowY={"auto"}
      scrollBehavior={"smooth"}
      ref={parentRef}
      sx={scrollbar}
    >
      <Box
        position={"sticky"}
        top={0}
        zIndex={1}
        bg="white"
        px={3}
        pt={3}
        pb={2}
        borderBottom="1px solid"
        borderColor="sky.100"
      >
        <PanelTitle
          title="Bank"
          extra={<Text fontSize="sm">{bank.length}</Text>}
        />
        <Flex wrap="wrap" align="center" columnGap={4} rowGap={1} mb={2}>
          <RadioGroup value={sortBy} onChange={setSortBy}>
            <Stack direction="row" gap={3} align="center">
              <Radio value={"id"}>ID</Radio>
              <Radio value={"level"}>Level</Radio>
              <Radio value={"name"}>Name</Radio>
            </Stack>
          </RadioGroup>
          <Checkbox onChange={() => setIsShiny((prev) => !prev)}>
            Shiny only
          </Checkbox>
        </Flex>
        <Input
          value={searchTerm}
          onChange={handleSearch}
          size="sm"
          borderRadius="full"
          bg="sky.50"
          borderColor="sky.200"
          placeholder="Search Pokémon"
          aria-label="Search Pokémon"
        />
      </Box>
      {bank.length === 0 && (
        <Text fontSize="sm" color="sky.700" px={3} py={2}>
          Pokémon you catch when your party is full are kept here.
        </Text>
      )}
      <Box
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((item) => {
          const pokemon = pokemonBank[item.index];
          const uuid = pokemon.uuid;
          const name = formatName(pokemon.name);
          const isSelected = selectedPokemon.uuid === pokemon.uuid;
          return (
            <Flex
              key={`${item.key}`}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height={`${item.size}px`}
              transform={`translateY(${item.start}px)`}
              align="center"
              justify="space-between"
              gap={2}
              px={2}
              borderBottom="1px solid"
              borderColor="sky.100"
            >
              <Flex
                as="button"
                type="button"
                align="center"
                gap={2}
                minW="0"
                flex="1"
                pr={2}
                textAlign="left"
                borderRadius="lg"
                border="2px solid"
                bg={isSelected ? "gold.100" : "transparent"}
                borderColor={isSelected ? "gold.500" : "transparent"}
                _hover={{ bg: isSelected ? "gold.100" : "sky.50" }}
                _focusVisible={{ borderColor: "sky.500", outline: "none" }}
                aria-pressed={isSelected}
                aria-label={`Select ${name}, Level ${pokemon.level}`}
                onClick={() => setPokemon(uuid)}
              >
                <Image alt="" src={pokemon.image} boxSize="72px" />
                <Box minW="0" fontSize="sm">
                  <Text fontWeight={700} noOfLines={1}>
                    {name}
                  </Text>
                  <Text color="sky.700">
                    Lv {pokemon.level}
                    {pokemon.isShiny && (
                      <Text as="span" color="gold.500" fontWeight={700}>
                        {" "}
                        ★ Shiny
                      </Text>
                    )}
                  </Text>
                </Box>
              </Flex>
              <Button
                aria-label={
                  uuid === release
                    ? `Confirm release of ${name}`
                    : `Release ${name}`
                }
                colorScheme={uuid === release ? "red" : "gray"}
                variant={uuid === release ? "solid" : "ghost"}
                size="xs"
                flexShrink={0}
                onClick={() => {
                  setSelectedPokemon({
                    uuid: null,
                    place: null,
                  });
                  if (uuid !== release) {
                    setRelease(uuid);
                  } else {
                    releasePokemon(uuid);
                    setRelease(null);
                  }
                }}
              >
                {uuid === release ? "Confirm release" : "Release"}
              </Button>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}
