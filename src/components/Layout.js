import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Box, Flex, Link, useDisclosure, Text, Button } from "@chakra-ui/react";
import SaveLoadModal from "./SaveLoadModal";
import { auth } from "@/config";
import useAuth from "@/hooks/useAuth";

export default function Layout({ children }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onClick = () => {
    if (user) {
      signOut(auth);
    } else {
      signInWithPopup(auth, new GoogleAuthProvider());
    }
  };

  return (
    <Box>
      <SaveLoadModal isOpen={isOpen} onClose={onClose} />
      <Flex bg="poke.darkBlue" color="white" justifyContent="space-between" alignItems="center" p={2} mb={2} boxShadow="md">
        <Text fontWeight="bold" fontSize="lg" fontFamily="'Zen Kaku Gothic New', sans-serif">PikaClicker</Text>
        <Flex gap={4} alignItems="center">
          <Button size="sm" variant="outline" colorScheme="whiteAlpha" onClick={onOpen}>
            Save/Load
          </Button>
          <Button size="sm" variant="solid" colorScheme="yellow" color="poke.dark" onClick={onClick}>
            {user ? "Sign Out" : "Sign In"}
          </Button>
        </Flex>
      </Flex>
      <Box px={2}>{children}</Box>
    </Box>
  );
}
