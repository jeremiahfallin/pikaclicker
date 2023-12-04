import useAuth from "@/hooks/useAuth";
import useGameStore from "@/hooks/useGameStore";
import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Switch,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import superjson from "superjson";

// TODO: Right now only the ball is implemented, everything else is just visual
export default function Settings() {
  const { onCopy, setValue, hasCopied } = useClipboard("");
  const settings = useGameStore((state) => state.settings);
  const items = useGameStore((state) => state.player.items);
  const data = useGameStore();
  const { saveData, loadData } = useAuth();

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
        <Button size="xs" onClick={saveData}>
          Save
        </Button>
        <Button size="xs" onClick={loadData}>
          Load
        </Button>
      </Flex>
    </Box>
  );
}
