import { extendTheme } from "@chakra-ui/react";
import { Fredoka, Nunito } from "next/font/google";

// Fonts are downloaded at build time and served with the game, so they work
// offline and don't load from Google when someone plays.
// Fredoka: round and chunky, for headings. Nunito: friendly and easy to read.
const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600"] });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"] });

const scrollbar = {
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "sky.300",
    borderRadius: "24px",
    border: "2px solid transparent",
  },
};

const theme = extendTheme({
  fonts: {
    heading: fredoka.style.fontFamily,
    body: nunito.style.fontFamily,
  },
  colors: {
    // Page, panels and text.
    sky: {
      50: "#f2f8ff",
      100: "#dcefff",
      200: "#b9daf5",
      300: "#8cc2ee",
      400: "#5aa5e2",
      500: "#2f86cf",
      600: "#1d6fb3",
      700: "#1d5fa0",
      800: "#173f6b",
      900: "#1f3550",
    },
    // The header.
    brand: {
      50: "#fdecea",
      100: "#f9cdc9",
      200: "#f4a39c",
      300: "#ee776d",
      400: "#e95c51",
      500: "#e5483e",
      600: "#c93a31",
      700: "#a62f27",
      800: "#83251f",
      900: "#5e1a16",
    },
    // Coins.
    gold: {
      100: "#fff4c7",
      300: "#ffd23f",
      500: "#e6b400",
      900: "#3a2a00",
    },
  },
  styles: {
    global: {
      "html, body": {
        height: "100%",
        scrollBehavior: "smooth",
        bg: "sky.100",
        color: "sky.900",
        ...scrollbar,
      },
      "#__next": {
        height: "100%",
        maxHeight: "100%",
      },
    },
  },
  components: {
    Heading: {
      baseStyle: { fontWeight: 600, color: "sky.700" },
    },
    Progress: {
      baseStyle: {
        track: { bg: "blackAlpha.100", borderRadius: "full" },
        filledTrack: { borderRadius: "full", transition: "width 0.3s" },
      },
    },
    Switch: { defaultProps: { colorScheme: "sky" } },
    Radio: { defaultProps: { colorScheme: "sky", size: "sm" } },
    Checkbox: { defaultProps: { colorScheme: "sky", size: "sm" } },
    Button: {
      baseStyle: { fontFamily: "heading", fontWeight: 500 },
      variants: {
        // Buttons drawn on top of a scene picture: white, so they stand out
        // against any background.
        scene: {
          bg: "whiteAlpha.900",
          color: "sky.800",
          borderRadius: "full",
          boxShadow: "md",
          _hover: { bg: "white", transform: "translateY(-1px)" },
          _active: { transform: "none" },
        },
      },
    },
  },
});

export { scrollbar };
export default theme;
