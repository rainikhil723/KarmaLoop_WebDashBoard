import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    points_hard: 0,
    points_mod: 0,
    points_easy: 0,
    points_dist: 0,
    points_total: 0,
    rank: "Novice",
    activeDays: 0, // New: Active Days Counter
    loading: true
  });

  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // 🔢 Integer Conversion (Math.round use kiya taaki 30.5 -> 31 ho jaye)
        const p_hard = Math.round(data.points_hard || 0);
        const p_mod = Math.round(data.points_mod || 0);
        const p_easy = Math.round(data.points_easy || 0);
        const p_dist = Math.round(data.points_dist || 0);
        const p_total = Math.round(data.points_total || 0);
        
        // Active Days (Agar DB mein nahi hai to default 1)
        const activeDays = data.active_days || 1; 

        // Rank Logic
        let currentRank = "Novice";
        if (p_total > 50) currentRank = "Apprentice";
        if (p_total > 200) currentRank = "Focus Master";
        if (p_total > 1000) currentRank = "Grandmaster";

        setStats({
          points_hard: p_hard,
          points_mod: p_mod,
          points_easy: p_easy,
          points_dist: p_dist,
          points_total: p_total,
          rank: currentRank,
          activeDays: activeDays,
          loading: false
        });
      }
    });

    return () => unsub();
  }, [user]);

  return stats;
};

export default useUserStats;