import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config";
import superjson from "superjson";
import useGameStore from "@/hooks/useGameStore";

export default function useGym(leader) {
  const [gymLeader, setGymLeader] = useState(null);
  const [gymPokemon, setGymPokemon] = useState(null);

  useEffect(() => {
    setGymLeader(leader);
  }, [leader]);

  useEffect(() => {
    loadGymLeader();
  }, [gymLeader]);

  async function loadGymLeader() {
    if (!gymLeader) return;

    if (gymLeader === "Olivia") {
      const dataDoc = doc(
        db,
        "CapOlX5zrCUTWsQn5EUwxmca6ha2",
        "CapOlX5zrCUTWsQn5EUwxmca6ha2"
      );

      const docSnap = await getDoc(dataDoc);
      const data = docSnap.data();
      if (data) {
        setGymPokemon(superjson.parse(data.data.player.party));
      }
    }
    if (gymLeader === "Chris") {
      const dataDoc = doc(
        db,
        "Dp2FEH1qrlPFSyveiMtgdM9YXFM2",
        "Dp2FEH1qrlPFSyveiMtgdM9YXFM2"
      );

      const docSnap = await getDoc(dataDoc);
      const data = docSnap.data();
      if (data) {
        setGymPokemon(superjson.parse(data.data.player.party));
      }
    }
  }

  return { gymPokemon };
}
