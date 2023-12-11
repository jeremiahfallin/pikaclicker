import { useEffect, useRef } from "react";
import { useToast } from "@chakra-ui/react";

export default function useEventToast() {
  const toast = useToast();
  const toastIdRef = useRef();

  useEffect(() => {
    toastIdRef.current = toast({
      title: "Event",
      description: "You found a wild Pokémon!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    return () => {
      toast.close(toastIdRef.current);
    };
  }, [toast]);
}
