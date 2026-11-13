import dynamic from "next/dynamic";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import SaveLoadModal from "./SaveLoadModal";
import { loadFirebase } from "@/config";
import useAuth from "@/hooks/useAuth";

// The coin count comes from the save in the browser, so don't draw it while
// the page is built ahead of time.
const Coins = dynamic(() => import("./Coins"), { ssr: false });

const headerButton = {
  size: "xs",
  variant: "ghost",
  color: "white",
  _hover: { bg: "whiteAlpha.300" },
  _active: { bg: "whiteAlpha.400" },
};

export default function Layout({ children }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onClick = async () => {
    // useAuth starts loading Firebase when the page mounts, so by the time
    // anyone clicks this has normally resolved and the sign-in popup opens
    // within the click (browsers block popups opened later).
    const { auth, GoogleAuthProvider, signInWithPopup, signOut } =
      await loadFirebase();
    if (user) {
      signOut(auth);
    } else {
      signInWithPopup(auth, new GoogleAuthProvider());
    }
  };

  // On wider screens the page is exactly one screen tall and each column
  // scrolls on its own. On phones the page just scrolls.
  return (
    <Flex direction="column" h={{ md: "100vh" }}>
      <SaveLoadModal isOpen={isOpen} onClose={onClose} />
      <Flex
        as="header"
        bg="brand.500"
        align="center"
        justify="space-between"
        gap={3}
        px={3}
        py={1.5}
        flexShrink={0}
        boxShadow="sm"
      >
        <Heading as="h1" size="md" color="white" letterSpacing="wide">
          PikaClicker
        </Heading>
        <Flex align="center" gap={1}>
          <Coins />
          <Button {...headerButton} onClick={onOpen}>
            Save/Load
          </Button>
          <Button {...headerButton} onClick={onClick}>
            {user ? "Sign out" : "Sign in"}
          </Button>
        </Flex>
      </Flex>
      <Box as="main" flex="1" minH="0" overflowY={{ md: "auto" }}>
        {children}
      </Box>
    </Flex>
  );
}
