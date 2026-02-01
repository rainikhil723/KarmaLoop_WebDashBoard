import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

const useHistory = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      console.log('[useHistory] No user found');
      return;
    }

    const fetchHistory = async () => {
      try {
        console.log('[useHistory] Fetching history for user:', user.uid);
        // 1. Fetch last 365 days of history
        const historyRef = collection(db, "users", user.uid, "history");
        const q = query(historyRef, orderBy("date", "asc")); // Oldest to Newest
        const querySnapshot = await getDocs(q);

        console.log('[useHistory] Documents found:', querySnapshot.size);

        const data = querySnapshot.docs.map(doc => ({
          date: doc.id, // ID is the date string "2025-05-26"
          count: doc.data().points || 0, // Points earned that day
        }));

        console.log('[useHistory] Processed data:', data.length, 'days');
        if (data.length > 0) {
          console.log('[useHistory] Sample:', data.slice(0, 3));
        }

        setHistoryData(data);
      } catch (error) {
        console.error("[useHistory] Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return { historyData, loading };
};

// 🔥 CLEAR ALL HISTORY DATA
export const clearAllHistory = async (uid) => {
  try {
    const historyRef = collection(db, "users", uid, "history");
    const querySnapshot = await getDocs(historyRef);
    
    console.log(`Deleting ${querySnapshot.size} history documents...`);
    
    const deletePromises = querySnapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, "users", uid, "history", docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
    console.log("✅ All history data cleared!");
    window.location.reload();
  } catch (error) {
    console.error("Error clearing history:", error);
  }
};

// 🔥 GOD MODE UTILITY: This generates fake history so your graph isn't empty today.
// Run this ONCE from the console or a button to populate your DB.
export const seedDatabase = async (uid) => {
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Random points between 0 and 50
    // Logic: 30% chance of being 0 (Lazy day), else random points
    const points = Math.random() > 0.3 ? Math.floor(Math.random() * 50) : 0;
    
    if (points > 0) {
        await setDoc(doc(db, "users", uid, "history", dateStr), {
            date: dateStr,
            points: points,
            active: true
        });
    }
  }
  console.log("Database Seeded with Godly Data 🚀");
  window.location.reload();
};

export default useHistory;