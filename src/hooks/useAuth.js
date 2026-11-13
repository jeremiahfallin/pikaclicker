import { useEffect, useState } from "react";
import superjson from "superjson";
import { loadFirebase } from "@/config";
import useGameStore, { loadSave } from "@/hooks/useGameStore";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    let unmounted = false;
    loadFirebase()
      .then(({ auth, onAuthStateChanged }) => {
        if (unmounted) return;
        unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
      })
      .catch((error) => console.error("Could not load Firebase", error));
    return () => {
      unmounted = true;
      unsubscribe();
    };
  }, []);

  async function loadData() {
    const { db, doc, getDoc } = await loadFirebase();
    const dataDoc = doc(db, user.uid, user.uid);
    // read the data
    const docSnap = await getDoc(dataDoc);
    const data = docSnap.data();
    if (data) {
      loadSave(superjson.parse(data.data));
    }
  }

  async function saveData() {
    const { db, doc, setDoc } = await loadFirebase();
    const dataDoc = doc(db, user.uid, user.uid);
    const data = useGameStore.getState();
    await setDoc(
      dataDoc,
      { data: superjson.stringify(data) },
      { merge: true }
    );
  }

  return { user, loadData, saveData };
}
