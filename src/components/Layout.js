import { Box, Center, Link, useDisclosure } from "@chakra-ui/react";
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

  return (
    <Box>
      <SaveLoadModal isOpen={isOpen} onClose={onClose} />
      <Center bg="blue.200" justifyContent={"end"} p={1} gap={2}>
        <Link as="button" type="button" onClick={onOpen} fontSize="xs">
          Save/Load
        </Link>
        <Link as="button" type="button" onClick={onClick} fontSize="xs">
          {user ? "Sign Out" : "Sign In"}
        </Link>
      </Center>
      <Box>{children}</Box>
    </Box>
  );
}
