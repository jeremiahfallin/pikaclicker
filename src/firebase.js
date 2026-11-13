// The Firebase SDK. Only import this through loadFirebase() in "@/config", so
// it stays out of the first download and the game can render without it.
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// The game only reads and writes single documents, which the lite SDK covers
// at a fraction of the size of the full one (no realtime listeners or offline
// cache, neither of which the game uses).
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyDrpRJ3Dp8P16N82f_XyaJxOjLq9Sc1tpc",
  authDomain: "pikaclicker.firebaseapp.com",
  projectId: "pikaclicker",
  storageBucket: "pikaclicker.appspot.com",
  messagingSenderId: "11878923982",
  appId: "1:11878923982:web:e966e2e6cfaaa772f19a9f",
  measurementId: "G-7XX35WZ7W9",
};

const app = initializeApp(firebaseConfig);
// Auth is set up before Firestore so Firestore requests carry the signed-in
// user's token, which the security rules check.
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  GoogleAuthProvider,
  doc,
  getDoc,
  onAuthStateChanged,
  setDoc,
  signInWithPopup,
  signOut,
};
