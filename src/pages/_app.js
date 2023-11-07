// pages/_app.js
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// create theme
const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        overflow: "hidden",
        height: "100%",
      },
      // next id
      "#__next": {
        height: "100%",
        maxHeight: "100%",
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
