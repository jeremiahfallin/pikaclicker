import useAuth from "@/hooks/useAuth";
import useGameStore from "@/hooks/useGameStore";
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Select,
  Switch,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { useState } from "react";
import superjson from "superjson";

// TODO: Right now only the ball is implemented, everything else is just visual
export default function Settings() {
  const [load, setLoad] = useState("");
  const { onCopy, setValue, hasCopied } = useClipboard("");
  const settings = useGameStore((state) => state.settings);
  const items = useGameStore((state) => state.player.items);
  const data = useGameStore();
  const { user, saveData, loadData } = useAuth();

  const loadGameFromText = () => {
    useGameStore.setState(load);
  };

  return (
    <Box>
      <Heading as="h3" size="md">
        Settings
      </Heading>
      <Flex direction="row" justify="space-between">
        <Text>Repeat Pokemon</Text>
        <Switch
          onChange={() =>
            useGameStore.setState({
              settings: { ...settings, repeatPokemon: !settings.repeatPokemon },
            })
          }
          isChecked={settings.repeatPokemon}
        />
      </Flex>
      <Flex direction="row" justify="space-between">
        <Text>New Pokemon</Text>
        <Switch
          onChange={() =>
            useGameStore.setState({
              settings: { ...settings, newPokemon: !settings.newPokemon },
            })
          }
          isChecked={settings.newPokemon}
        />
      </Flex>
      <Flex direction="row" justify="space-between">
        <Text>Shiny Pokemon</Text>
        <Switch
          onChange={() =>
            useGameStore.setState({
              settings: { ...settings, shinyPokemon: !settings.shinyPokemon },
            })
          }
          isChecked={settings.shinyPokemon}
        />
      </Flex>
      <Flex direction="row" justify="space-between">
        <Text>Legendary Pokemon</Text>
        <Switch
          onChange={() =>
            useGameStore.setState({
              settings: {
                ...settings,
                legendaryPokemon: !settings.legendaryPokemon,
              },
            })
          }
          isChecked={settings.legendaryPokemon}
        />
      </Flex>
      <Flex direction="row" justify="space-between">
        <Text>Ball</Text>
        <Select
          width="120px"
          size="xs"
          value={settings.ball}
          onChange={(e) =>
            useGameStore.setState({
              settings: {
                ...settings,
                ball: e.target.value,
              },
            })
          }
        >
          {items
            .filter((item) => item.type === "ball")
            .map((item) => {
              return (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              );
            })}
        </Select>
      </Flex>
      <Flex direction="row" justify="space-between" p={2}>
        <Button
          size="xs"
          onClick={() => {
            const saveData = superjson.stringify(data);
            setValue(saveData);
            onCopy();
          }}
        >
          {hasCopied ? "Copied!" : "Copy"}
        </Button>
        <Button size="xs" onClick={loadGameFromText}>
          Load from Text
        </Button>
        {user && (
          <>
            <Button size="xs" onClick={saveData}>
              Save
            </Button>
            <Button size="xs" onClick={loadData}>
              Load
            </Button>
          </>
        )}
      </Flex>
      <Editable
        defaultValue={superjson.stringify(data)}
        onChange={(value) => {
          try {
            const parsed = superjson.parse(value);
            setLoad(parsed);
          } catch (e) {
            console.error(e);
          }
        }}
        w="300px"
        h="100px"
        overflow="hidden"
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Box>
  );
}
