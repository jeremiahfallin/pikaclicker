import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import useGameStore from "@/hooks/useGameStore";

export default function DebugPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Box overflowY="scroll">
      <Box h="100%">
        <pre>{JSON.stringify(useGameStore.getState(), null, 2)}</pre>
      </Box>
    </Box>
  );
}
