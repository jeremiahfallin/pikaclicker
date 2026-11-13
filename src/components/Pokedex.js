import { useState } from "react";
import {
  Flex,
  Image,
  SimpleGrid,
  Text,
  RadioGroup,
  Radio,
  Stack,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";
import pokes from "../pokes.json";
import { getHexDetails, pokesById } from "@/utils";
import { formatName, formatSlug } from "@/utils/display";
import { scrollbar } from "@/theme";
import Panel from "./Panel";

// TODO: Add more info to the pokedex (e.g. id#, types, etc.)

// One entry: name over sprite. Pokémon seen but not caught are grayed out.
function Entry({ poke, isCaught }) {
  return (
    <Flex
      direction="column"
      align="center"
      bg="sky.50"
      borderRadius="md"
      p={1}
      h="100%"
      cursor={isCaught ? "help" : "default"}
    >
      <Text fontSize="xs" fontWeight={600} noOfLines={1} textAlign="center">
        {formatName(poke.name)}
      </Text>
      <Image
        alt={formatName(poke.name)}
        src={poke.sprites.front_default}
        maxW="100%"
        filter={isCaught ? undefined : "grayscale(1)"}
        opacity={isCaught ? 1 : 0.6}
      />
    </Flex>
  );
}

// "Evolves to Ivysaur at level 16." for each way this Pokémon evolves.
function evolutionText(poke) {
  if (poke.evolvesTo === null) {
    return "Final evolution.";
  }
  const lines = [];
  poke.evolvesTo.forEach((e) => {
    const target = formatName(e.pokemon_name);
    e.evolution_conditions.forEach((c) => {
      if (c.trigger === "level-up") {
        lines.push(`Evolves to ${target} at level ${c.level}.`);
      } else if (c.trigger === "use-item") {
        lines.push(`Evolves to ${target} when using ${formatSlug(c.item)}.`);
      } else if (c.trigger === "other") {
        lines.push(`Evolves to ${target} under special conditions.`);
      }
    });
  });
  return lines.join(" ");
}

export default function Pokedex() {
  const [sortBy, setSortBy] = useState("id");
  const [inArea, setInArea] = useState(false);
  const [filterBy, setFilterBy] = useState("seen");
  const { caught, seen } = useGameStore((state) => state.player.pokedex);

  // 1. Find hex you're on
  const { q, r } = useGameStore((state) => state.player.currentHex);
  // 2. Find out which pokemon are on that hex
  const pokemonInArea = getHexDetails(q, r);
  // 3. Filter pokedex by those pokemon (below)

  const pokedex = [...new Set([...seen, ...caught])].flatMap((poke) => {
    if (!poke) {
      return [];
    }
    return pokesById[poke] || [];
  });

  const handleAreaCheckbox = (e) => {
    setInArea(e.target.checked);
  };

  return (
    <Panel
      title="Pokédex"
      extra={
        <Text fontSize="sm">
          {caught.size}/{pokes.length} caught
        </Text>
      }
    >
      {/* Wraps onto more lines when the column is narrow. */}
      <Flex wrap="wrap" align="center" columnGap={4} rowGap={1} mb={2}>
        <RadioGroup value={sortBy} onChange={setSortBy}>
          <Stack direction="row" gap={3} align="center">
            <Radio value="id">Number</Radio>
            <Radio value="name">Name</Radio>
          </Stack>
        </RadioGroup>
        <RadioGroup value={filterBy} onChange={setFilterBy}>
          <Stack direction="row" gap={3} align="center">
            <Radio value="seen">Seen</Radio>
            <Radio value="caught">Caught</Radio>
          </Stack>
        </RadioGroup>
        <Checkbox onChange={handleAreaCheckbox}>This area</Checkbox>
      </Flex>

      {/* As many columns as fit, rather than a fixed three. */}
      <SimpleGrid
        minChildWidth="80px"
        spacing={1}
        maxH="300px"
        overflowY={"auto"}
        scrollBehavior={"smooth"}
        sx={scrollbar}
      >
        {pokedex
          .sort((a, b) => {
            switch (sortBy) {
              case "id":
                return a.id - b.id;
              case "name":
                return a.name.localeCompare(b.name);
              default:
                return a.id - b.id;
            }
          })
          .filter((poke) => {
            if (filterBy === "caught" && !caught.has(poke.id)) {
              return false;
            }
            if (!inArea) {
              return true;
            }
            if (pokemonInArea.pokemon.includes(poke.name)) {
              return true;
            }
            return false;
          })
          .map((poke) => {
            if (!caught.has(poke.id)) {
              return <Entry key={poke.id} poke={poke} isCaught={false} />;
            }
            return (
              <Popover key={poke.id} trigger="hover">
                <PopoverTrigger>
                  <div>
                    <Entry poke={poke} isCaught />
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontFamily="heading">
                    {formatName(poke.name)}
                  </PopoverHeader>
                  <PopoverBody>
                    <Text fontSize="sm">{evolutionText(poke)}</Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            );
          })}
      </SimpleGrid>
    </Panel>
  );
}
