import { useState, useRef } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Box,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import useStickyState from "@/hooks/useStickyState";
import useSave from "@/hooks/useSave";
import pokes from "../pokes";
import SuperJSON from "superjson";

const selectablePokemon = pokes
  .filter((p) => p.evolvesTo === null)
  .filter((p) => !p.name.includes("-"))
  .map((p) => ({
    id: p.id,
    name: p.name,
    image: p.sprites.front_default,
  }));

const PokemonWheel = ({ selectPokemon, idx }) => {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: selectablePokemon.length,
    getScrollElement: () => parentRef.current,
    overscan: 5,
    estimateSize: () => 120,
  });
  return (
    <Box
      overflowY={"scroll"}
      scrollBehavior={"smooth"}
      ref={parentRef}
      height={"360px"}
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
      <Box
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const pokemon = selectablePokemon[item.index];
          return (
            <Center
              key={`${item.key}`}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              flexDir={"column"}
              height={`${item.size}px`}
              transform={`translateY(${item.start}px)`}
            >
              <Box
                onClick={() => selectPokemon(pokemon.name, idx)}
                cursor="pointer"
              >
                <Image src={pokemon.image} alt={pokemon.name} />
              </Box>
            </Center>
          );
        })}
      </Box>
    </Box>
  );
};

const SaveLoadModal = ({ isOpen, onClose }) => {
  const [selectedPokemon, setSelectedPokemon] = useState([null, null, null]);
  const { saveData, loadData } = useSave();

  const selectPokemon = (pokemon, idx) => {
    // Select Pokemon at index. Unselect if already selected.
    setSelectedPokemon((prev) => {
      const newSelected = [...prev];
      if (newSelected[idx] === pokemon) {
        newSelected[idx] = null;
      } else {
        newSelected[idx] = pokemon;
      }
      return newSelected;
    });
  };

  const handleSave = (selectedPokemon) => {
    const pokemonString = selectedPokemon.join("-");
    if (!pokemonString) return;
    saveData(selectedPokemon);

    onClose();
  };

  const handleLoad = (selectedPokemon) => {
    const pokemonString = selectedPokemon.join("-");
    if (!pokemonString) return;
    loadData(selectedPokemon);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save Your Game</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={3} spacing={2}>
            <PokemonWheel selectPokemon={selectPokemon} idx={0} />
            <PokemonWheel selectPokemon={selectPokemon} idx={1} />
            <PokemonWheel selectPokemon={selectPokemon} idx={2} />
          </SimpleGrid>
          <Box mt={4}>Selected Pokémon:</Box>
          <SimpleGrid columns={3} spacing={2}>
            {selectedPokemon.map((pokemon, idx) => (
              <Center key={`${idx}-${pokemon}`}>
                <Image
                  src={
                    pokemon
                      ? pokes.find((p) => p.name === pokemon).sprites
                          .front_default
                      : null
                  }
                  alt={pokemon}
                />
              </Center>
            ))}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleSave(selectedPokemon)}
          >
            Save
          </Button>
          <Button
            colorScheme="green"
            onClick={() => handleLoad(selectedPokemon)}
          >
            Load
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveLoadModal;
