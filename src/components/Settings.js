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
  Text,
} from "@chakra-ui/react";
import Panel from "./Panel";

// One on/off setting. Clicking the label flips the switch too. A hint, if
// given, explains it under the label.
function SettingSwitch({ id, label, hint, setting }) {
  const settings = useGameStore((state) => state.settings);
  return (
    <FormControl
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
    >
      <FormLabel htmlFor={id} mb={0} fontSize="sm" fontWeight={400}>
        {label}
        {hint && (
          <Text as="span" display="block" fontSize="xs" color="sky.700">
            {hint}
          </Text>
        )}
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

// Which wild Pokémon to throw a ball at: any that matches a switch that's on.
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
        <SettingSwitch
          id="setting-missing-evolution"
          label="Missing evolutions"
          hint="Catch repeats that evolve into one you haven't caught"
          setting="missingEvolutionPokemon"
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
