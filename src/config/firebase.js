import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVBch8UIZ7aljdww259KkMcZ_xhEKJcBY",
  authDomain: "karmaloop-94f77.firebaseapp.com",
  projectId: "karmaloop-94f77",
  storageBucket: "karmaloop-94f77.firebasestorage.app",
  messagingSenderId: "730687465416",
  appId: "1:730687465416:web:e92f227f52f710149e42fd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);