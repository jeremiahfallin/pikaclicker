import useGameStore from "@/hooks/useGameStore";
import Battle from "./Battle";
import Town from "./Town";

export default function Scene() {
  const isInTown = useGameStore((state) => state.player.isInTown);

  if (isInTown) {
    return <Town />;
  } else {
    return <Battle />;
  }
}
