import { Box, Center, Flex, Link, useDisclosure } from "@chakra-ui/react";
import SaveLoadModal from "./SaveLoadModal";
import { loadFirebase } from "@/config";
import useAuth from "@/hooks/useAuth";

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
      <Center
        as="header"
        bg="blue.200"
        justifyContent={"end"}
        p={1}
        gap={2}
        flexShrink={0}
      >
        <Link as="button" type="button" onClick={onOpen} fontSize="xs">
          Save/Load
        </Link>
        <Link as="button" type="button" onClick={onClick} fontSize="xs">
          {user ? "Sign Out" : "Sign In"}
        </Link>
      </Center>
      <Box as="main" flex="1" minH="0" overflowY={{ md: "auto" }}>
        {children}
      </Box>
    </Flex>
  );
}
