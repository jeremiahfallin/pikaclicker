import useAuth from "@/hooks/useAuth";
import useGameStore from "@/hooks/useGameStore";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Switch,
} from "@chakra-ui/react";
import Panel from "./Panel";

// One on/off setting. Clicking the label flips the switch too.
function SettingSwitch({ id, label, setting }) {
  const settings = useGameStore((state) => state.settings);
  return (
    <FormControl display="flex" alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor={id} mb={0} fontSize="sm" fontWeight={400}>
        {label}
      </FormLabel>
      <Switch
        id={id}
        onChange={() =>
          useGameStore.setState({
            settings: { ...settings, [setting]: !settings[setting] },
          })
        }
        isChecked={settings[setting]}
      />
    </FormControl>
  );
}

// TODO: Right now only the ball is implemented, everything else is just visual
export default function Settings() {
  const settings = useGameStore((state) => state.settings);
  const items = useGameStore((state) => state.player.items);
  const { user, saveData, loadData } = useAuth();

  return (
    <Panel title="Settings">
      <Stack spacing={1}>
        <SettingSwitch
          id="setting-repeat"
          label="Repeat Pokémon"
          setting="repeatPokemon"
        />
        <SettingSwitch id="setting-new" label="New Pokémon" setting="newPokemon" />
        <SettingSwitch
          id="setting-shiny"
          label="Shiny Pokémon"
          setting="shinyPokemon"
        />
        <SettingSwitch
          id="setting-legendary"
          label="Legendary Pokémon"
          setting="legendaryPokemon"
        />
        <FormControl
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <FormLabel htmlFor="setting-ball" mb={0} fontSize="sm" fontWeight={400}>
            Ball
          </FormLabel>
          <Select
            id="setting-ball"
            width="140px"
            size="sm"
            borderRadius="full"
            bg="sky.50"
            borderColor="sky.200"
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
        </FormControl>
      </Stack>
      {user && (
        <Flex direction="row" justify="space-between" pt={3}>
          <Button size="xs" onClick={saveData}>
            Save
          </Button>
          <Button size="xs" onClick={loadData}>
            Load
          </Button>
        </Flex>
      )}
    </Panel>
  );
}
