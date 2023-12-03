// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrpRJ3Dp8P16N82f_XyaJxOjLq9Sc1tpc",
  authDomain: "pikaclicker.firebaseapp.com",
  projectId: "pikaclicker",
  storageBucket: "pikaclicker.appspot.com",
  messagingSenderId: "11878923982",
  appId: "1:11878923982:web:e966e2e6cfaaa772f19a9f",
  measurementId: "G-7XX35WZ7W9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
