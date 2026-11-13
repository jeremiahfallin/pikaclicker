import { Box } from "@chakra-ui/react";

/**
 * The picture box every scene (battle, town, gym, Elite Four, meteor) draws in.
 * The backgrounds are all 1792×1024, a 7:4 shape, so the box keeps that shape
 * as its column grows. It never gets shorter than 200px, and never taller than
 * half the screen, so the map below stays in view.
 * @param {string} background - Name of the image in public/backgrounds, without ".webp".
 */
export default function SceneFrame({ background, children, ...rest }) {
  return (
    <Box
      position="relative"
      w="100%"
      minH="200px"
      maxH="min(380px, 50vh)"
      background={`url(backgrounds/${background}.webp)`}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      borderRadius="xl"
      boxShadow="md"
      sx={{ aspectRatio: "7 / 4" }}
      {...rest}
    >
      {children}
    </Box>
  );
}
