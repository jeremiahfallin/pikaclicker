import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import superjson from "superjson";
import { auth, db } from "@/config";
import useGameStore from "@/hooks/useGameStore";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return unsubscribe;
  }, []);

  async function loadData() {
    const dataDoc = doc(db, user.uid, user.uid);
    // read the data
    const docSnap = await getDoc(dataDoc);
    const data = docSnap.data();
    if (data) {
      useGameStore.setState(superjson.parse(data.data));
    }
  }

  function saveData() {
    const dataDoc = doc(db, user.uid, user.uid);
    const data = useGameStore.getState();
    setDoc(dataDoc, { data: superjson.stringify(data) }, { merge: true });
  }

  return { user, loadData, saveData };
}
