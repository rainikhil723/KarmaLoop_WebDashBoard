import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Google Login Function
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Check karo agar ye user pehli baar aaya hai, toh DB mein entry banao
      // (Waise Android app ne bana di hogi, par web ke liye safe side)
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          raw_sec_hard: 0,
          raw_sec_dist: 0,
          createdAt: new Date(),
        }, { merge: true });
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // 🔴 Logout Function
  const logOut = () => {
    signOut(auth);
  };

  // 👂 Listener: Check karta rehta hai user login hai ya nahi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};