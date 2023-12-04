import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Box, Center, Link } from "@chakra-ui/react";
import { auth } from "@/config";
import useAuth from "@/hooks/useAuth";

export default function Layout({ children }) {
  const user = useAuth();
  console.log(user);
  const onClick = () => {
    if (user) {
      signOut(auth);
    } else {
      signInWithPopup(auth, new GoogleAuthProvider());
    }
  };

  return (
    <Box>
      <Center bg="blue.200" justifyContent={"end"} p={1}>
        <Link as="button" type="button" onClick={onClick} fontSize="xs">
          {user ? "Sign Out" : "Sign In"}
        </Link>
      </Center>
      <Box>{children}</Box>
    </Box>
  );
}
