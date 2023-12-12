import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Box, Button, Center, Link, useClipboard } from "@chakra-ui/react";
import { auth } from "@/config";
import useAuth from "@/hooks/useAuth";
import useGameStore from "@/hooks/useGameStore";
import SuperJSON from "superjson";

export default function Layout({ children }) {
  const { user } = useAuth();
  const data = useGameStore();
  const clipboard = useClipboard(SuperJSON.stringify(data));
  const onClick = () => {
    if (user) {
      signOut(auth);
    } else {
      signInWithPopup(auth, new GoogleAuthProvider());
    }
  };

  const copy = () => {
    clipboard.onCopy();
  };

  return (
    <Box>
      <Center bg="blue.200" justifyContent={"end"} p={1}>
        <Button size="xs" onClick={copy}>
          Copy
        </Button>
        <Link as="button" type="button" onClick={onClick} fontSize="xs">
          {user ? "Sign Out" : "Sign In"}
        </Link>
      </Center>
      <Box>{children}</Box>
    </Box>
  );
}
