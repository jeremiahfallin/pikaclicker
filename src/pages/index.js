import { useEffect, useState } from "react";
import Game from "../components/Game";

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return <>{hasMounted && <Game />}</>;
}
