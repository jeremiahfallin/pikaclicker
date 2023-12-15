import { doc, getDoc, setDoc } from "firebase/firestore";
import superjson from "superjson";
import { db } from "@/config";
import useGameStore from "@/hooks/useGameStore";

export default function useSave() {
  async function loadData(selectedPokemon) {
    const pokemonString = selectedPokemon.join("-");
    if (!pokemonString) return;
    const dataDoc = doc(db, "saves", pokemonString);
    // read the data
    const docSnap = await getDoc(dataDoc);
    const data = docSnap.data();
    if (data) {
      useGameStore.setState(superjson.parse(data.data));
    }
  }

  function saveData(selectedPokemon) {
    const pokemonString = selectedPokemon.join("-");
    if (!pokemonString || pokemonString.split("-").length < 3) return;
    const dataDoc = doc(db, "saves", pokemonString);
    const data = useGameStore.getState();
    setDoc(dataDoc, { data: superjson.stringify(data) }, { merge: true });
  }

  return { loadData, saveData };
}
