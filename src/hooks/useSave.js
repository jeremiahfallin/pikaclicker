import { doc, getDoc, setDoc } from "firebase/firestore";
import superjson from "superjson";
import { auth, db } from "@/config";
import useGameStore, { loadSave } from "@/hooks/useGameStore";

export default function useSave() {
  async function loadData(selectedPokemon) {
    const pokemonString = selectedPokemon.join("-");
    if (!pokemonString) return;
    const dataDoc = doc(db, "saves", pokemonString);
    // read the data
    const docSnap = await getDoc(dataDoc);
    const data = docSnap.data();
    if (data) {
      loadSave(superjson.parse(data.data));
    }
  }

  function saveData(selectedPokemon) {
    const pokemonString = selectedPokemon.join("-");
    if (!pokemonString || pokemonString.split("-").length < 3) return;
    // Save codes are owned by the player who first saves to them; the
    // Firestore rules only accept writes that carry the caller's uid.
    const owner = auth.currentUser?.uid;
    if (!owner) return;
    const dataDoc = doc(db, "saves", pokemonString);
    const data = useGameStore.getState();
    setDoc(
      dataDoc,
      { data: superjson.stringify(data), owner },
      { merge: true }
    );
  }

  return { loadData, saveData };
}
