// pages/_app.js
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Layout from "@/components/Layout";

// create theme
const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        height: "100%",
        scrollBehavior: "smooth",
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
