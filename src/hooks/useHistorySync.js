import { useEffect, useRef } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const useHistorySync = (user, stats) => {
  const prevPointsRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Don't run while stats are still loading
    if (!user?.uid || stats.loading) return;

    const syncToday = async () => {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      const historyRef = doc(db, "users", user.uid, "history", dateStr);
      const docSnap = await getDoc(historyRef);

      // On first run, just initialize the ref without syncing
      if (!initializedRef.current) {
        prevPointsRef.current = stats.points_total;
        initializedRef.current = true;
        console.log("🔄 Initialized tracking at", stats.points_total, "points");
        return;
      }

      // Calculate the change in points since last sync
      const pointsChange = stats.points_total - prevPointsRef.current;
      
      if (pointsChange === 0) {
        console.log("⏭️ No change in points, skipping sync");
        return;
      }

      if (!docSnap.exists()) {
        // First time today - create with the change
        await setDoc(historyRef, {
          date: dateStr,
          points: pointsChange,
          active: pointsChange > 0
        });
        console.log("✅ Created history for today. Points earned:", pointsChange);
      } else {
        // Document exists - add the change to existing points
        const currentHistoryPoints = docSnap.data().points || 0;
        const newTotal = currentHistoryPoints + pointsChange;
        
        await updateDoc(historyRef, {
          points: newTotal,
          active: newTotal > 0
        });
        console.log(`✅ Updated: Was ${currentHistoryPoints}, added ${pointsChange}, now ${newTotal}`);
      }
      
      // Update the reference for next comparison
      prevPointsRef.current = stats.points_total;
    };

    syncToday();
  }, [user, stats.points_total]);
};

export default useHistorySync;