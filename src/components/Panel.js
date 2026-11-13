import { Box, Flex, Heading } from "@chakra-ui/react";

export const panelStyle = {
  bg: "white",
  border: "2px solid",
  borderColor: "sky.200",
  borderRadius: "xl",
};

/**
 * A white card that groups one section of the game (Pokédex, Party, Bank...).
 * @param {string} title - Heading at the top of the panel.
 * @param {React.ReactNode} extra - Shown at the right of the heading, e.g. a count.
 */
export default function Panel({ title, extra, children, ...rest }) {
  return (
    <Box {...panelStyle} p={3} {...rest}>
      {title && <PanelTitle title={title} extra={extra} />}
      {children}
    </Box>
  );
}

export function PanelTitle({ title, extra }) {
  return (
    <Flex align="baseline" justify="space-between" gap={2} mb={2}>
      <Heading as="h2" size="sm">
        {title}
      </Heading>
      {extra}
    </Flex>
  );
}
