import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKnkl136sORXP3zEPMtb_svBjTRIA7lQM",
  authDomain: "hacklingo-nova.firebaseapp.com",
  projectId: "hacklingo-nova",
  storageBucket: "hacklingo-nova.firebasestorage.app",
  messagingSenderId: "979354253715",
  appId: "1:979354253715:web:bd73e8bc4127ce2df59066",
  measurementId: "G-EE74NL2QJX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
