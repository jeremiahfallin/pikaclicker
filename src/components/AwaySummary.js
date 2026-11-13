import {
  Button,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { formatDuration, useAwayStore } from "@/game/away";

const close = () => useAwayStore.setState({ status: null });

const plural = (count, one, many = `${one}s`) =>
  `${count.toLocaleString()} ${count === 1 ? one : many}`;

function SummaryList({ summary }) {
  const lines = [
    summary.coins > 0 && plural(summary.coins, "coin"),
    summary.defeated > 0 && `${plural(summary.defeated, "Pokémon", "Pokémon")} defeated`,
    summary.caught > 0 && `${plural(summary.caught, "Pokémon", "Pokémon")} caught`,
    summary.newSpecies > 0 &&
      `${plural(summary.newSpecies, "new Pokédex entry", "new Pokédex entries")}`,
    summary.levels > 0 && `${plural(summary.levels, "level")} gained`,
    summary.ballsUsed > 0 && `${plural(summary.ballsUsed, "ball")} thrown`,
  ].filter(Boolean);

  if (lines.length === 0) {
    return <Text>Nothing much happened.</Text>;
  }
  return (
    <List spacing={1} styleType="disc" pl={5}>
      {lines.map((line) => (
        <ListItem key={line}>{line}</ListItem>
      ))}
    </List>
  );
}

// Tells the player what their party did while they were away.
export default function AwaySummary() {
  const { status, awayMs, creditedMs, summary } = useAwayStore();
  const isDone = status === "done";
  const capped = creditedMs < awayMs;

  return (
    <Modal
      isOpen={status !== null}
      onClose={close}
      isCentered
      closeOnOverlayClick={isDone}
      closeOnEsc={isDone}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome back!</ModalHeader>
        {isDone && <ModalCloseButton />}
        <ModalBody>
          {!isDone && (
            <Flex align="center" gap={3}>
              <Spinner size="sm" />
              <Text>Catching up on {formatDuration(creditedMs)} of battles…</Text>
            </Flex>
          )}
          {isDone && (
            <>
              <Text mb={3}>
                You were away for {formatDuration(awayMs)}.{" "}
                {capped
                  ? `Your party battled for ${formatDuration(creditedMs)}, the most it can while you're away:`
                  : "Your party kept battling:"}
              </Text>
              <SummaryList summary={summary} />
              {summary.sentHome && (
                <Text mt={3}>
                  Your party fainted and went home to rest.
                </Text>
              )}
            </>
          )}
        </ModalBody>
        {isDone && (
          <ModalFooter>
            <Button colorScheme="green" onClick={close}>
              Back to the game
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
