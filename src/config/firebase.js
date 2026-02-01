
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuIeOyBvkStJsWX-rJFqYska0Lh4EEHYM",   //used to connect firebase
  authDomain: "karmaloop-94f77.firebaseapp.com",        //used for authentication
  projectId: "karmaloop-94f77",                       //project id
  storageBucket: "karmaloop-94f77.firebasestorage.app", //storage pupose like mp4 etc
  messagingSenderId: "730687465416",
  appId: "1:730687465416:android:6a2821a843519af89e42fd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);   // Database export kiya
export const auth = getAuth(app);      // Login system export kiya