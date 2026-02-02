import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

const useLeaderboard = (maxUsers = 100) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query all users, ordered by points_total descending
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("points_total", "desc"), limit(maxUsers));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const usersPromises = querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const uid = docSnap.id;
        
        // Fetch active days from user's history subcollection
        const activeDays = await getActiveDaysFromHistory(uid);
        
        // Calculate hours studied
        const hoursStudied = calculateHoursStudied(data);
        
        return {
          uid: uid,
          displayName: data.displayName || 'Anonymous',
          photoURL: data.photoURL || null,
          location: data.location || null,
          points_total: Math.round(data.points_total || 0),
          points_hard: Math.round(data.points_hard || 0),
          points_mod: Math.round(data.points_mod || 0),
          points_easy: Math.round(data.points_easy || 0),
          points_dist: Math.round(data.points_dist || 0),
          active_days: activeDays,
          hours_studied: hoursStudied,
        };
      });

      const users = await Promise.all(usersPromises);

      // Sort with tiebreaker logic
      users.sort((a, b) => {
        // Primary: Total points (descending)
        if (b.points_total !== a.points_total) {
          return b.points_total - a.points_total;
        }
        // Tiebreaker 1: Hard points (descending)
        if (b.points_hard !== a.points_hard) {
          return b.points_hard - a.points_hard;
        }
        // Tiebreaker 2: Moderate points (descending)
        if (b.points_mod !== a.points_mod) {
          return b.points_mod - a.points_mod;
        }
        // Tiebreaker 3: Active days (descending)
        return b.active_days - a.active_days;
      });

      // Assign ranks (handling ties)
      users.forEach((user, index) => {
        if (index > 0) {
          const prev = users[index - 1];
          // If same points as previous user, give same rank
          if (user.points_total === prev.points_total && 
              user.points_hard === prev.points_hard &&
              user.points_mod === prev.points_mod) {
            user.rank = prev.rank;
          } else {
            user.rank = index + 1;
          }
        } else {
          user.rank = 1;
        }
      });

      setLeaderboard(users);
      setLoading(false);
    }, (error) => {
      console.error("[useLeaderboard] Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [maxUsers]);

  return { leaderboard, loading };
};

// Get active days count from user's history subcollection
const getActiveDaysFromHistory = async (uid) => {
  try {
    const historyRef = collection(db, "users", uid, "history");
    const querySnapshot = await getDocs(historyRef);
    
    // Count days where points > 0
    let activeDays = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.points > 0) {
        activeDays++;
      }
    });
    
    return activeDays;
  } catch (error) {
    console.error("[useLeaderboard] Error fetching history for", uid, error);
    return 0;
  }
};

// Calculate hours studied based on point categories
// Hard = 1 hour per point, Moderate = 45 min per point, Easy = 30 min per point
const calculateHoursStudied = (data) => {
  const hardMinutes = (data.points_hard || 0) * 60;      // 1 hour = 60 min per hard point
  const modMinutes = (data.points_mod || 0) * 45;        // 45 min per moderate point
  const easyMinutes = (data.points_easy || 0) * 30;      // 30 min per easy point
  
  const totalMinutes = hardMinutes + modMinutes + easyMinutes;
  const totalHours = totalMinutes / 60;
  
  return Math.round(totalHours * 10) / 10; // Round to 1 decimal place
};

export default useLeaderboard;
