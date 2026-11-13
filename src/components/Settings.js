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
} from "@chakra-ui/react";

// TODO: Right now only the ball is implemented, everything else is just visual
export default function Settings() {
  const settings = useGameStore((state) => state.settings);
  const items = useGameStore((state) => state.player.items);
  const { user, saveData, loadData } = useAuth();

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
      {user && (
        <Flex direction="row" justify="space-between" p={2}>
          <Button size="xs" onClick={saveData}>
            Save
          </Button>
          <Button size="xs" onClick={loadData}>
            Load
          </Button>
        </Flex>
      )}
    </Box>
  );
}
