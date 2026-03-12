// pages/_app.js
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Layout from "@/components/Layout";

// create theme
const theme = extendTheme({
  fonts: {
    heading: "'Zen Kaku Gothic New', sans-serif",
    body: "'Open Sans', 'Google Sans', sans-serif",
  },
  colors: {
    poke: {
      red: "#EE1515",
      darkRed: "#CC0000",
      blue: "#3B4CCA",
      darkBlue: "#26359A",
      yellow: "#FFDE00",
      gold: "#B3A125",
      light: "#F0F0F0",
      dark: "#222224",
    },
  },
  styles: {
    global: {
      "html, body": {
        height: "100%",
        scrollBehavior: "smooth",
        backgroundColor: "poke.light",
        color: "poke.dark",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray.700",
          borderRadius: "24px",
          border: "2px solid transparent",
        },
      },
      // next id
      "#__next": {
        height: "100%",
        maxHeight: "100%",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
      },
      variants: {
        pokeRed: {
          bg: "poke.red",
          color: "white",
          _hover: {
            bg: "poke.darkRed",
          },
        },
        pokeBlue: {
          bg: "poke.blue",
          color: "white",
          _hover: {
            bg: "poke.darkBlue",
          },
        },
      },
      defaultProps: {
        variant: "pokeBlue",
      },
    },
    Box: {
      variants: {
        panel: {
          bg: "white",
          borderWidth: "1px",
          borderColor: "gray.200",
          borderRadius: "lg",
          boxShadow: "sm",
          p: 4,
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;
