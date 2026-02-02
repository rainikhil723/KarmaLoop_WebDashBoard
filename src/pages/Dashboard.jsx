import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FocusHeatmap from '../components/FocusHeatmap';
import HistoryChart from '../components/HistoryChart';
import ProfileModal from '../components/ProfileModal';
import KarmaCard from '../components/KarmaCard';
import BadgesCard from '../components/BadgesCard';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import useUserStats from '../hooks/useUserStats'; 
import useHistorySync from '../hooks/useHistorySync';
import useLeaderboard from '../hooks/useLeaderboard';
import { seedDatabase, clearAllHistory } from '../hooks/useHistory';
import { Database, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const stats = useUserStats();
  const { leaderboard } = useLeaderboard(100);
  useHistorySync(user, stats);
  
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Get current user's rank and hours from leaderboard
  const currentUserData = leaderboard.find(u => u.uid === user?.uid);
  const userRank = currentUserData?.rank || null;
  const hoursStudied = currentUserData?.hours_studied || 0;

  // 🔥 Seed Database Function
  const handleSeedDatabase = async () => {
    if (window.confirm('Generate 1 year of fake activity data? This will populate your heatmap!')) {
      setSeeding(true);
      await seedDatabase(user.uid);
      setSeeding(false);
    }
  };

  // 🔥 Clear All History Function
  const handleClearHistory = async () => {
    if (window.confirm('⚠️ Delete ALL history data? This cannot be undone!')) {
      setClearing(true);
      await clearAllHistory(user.uid);
      setClearing(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          if (!data.bio) setModalOpen(true);
        }
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      <Navbar onPrint={() => window.print()} />

      <div className="p-4 md:p-8 flex justify-center">
        <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Left: Sidebar */}
          <div className="col-span-1">
              <Sidebar 
                userData={{...userData, karma: stats.points_total, rank: stats.rank}} 
                userRank={userRank}
                hoursStudied={hoursStudied}
              />
          </div>

          {/* Right: Main Content */}
          <div className="col-span-1 md:col-span-3 space-y-6">
              
              {/* 🔥 TOP ROW: LeetCode Style Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* 1. CIRCULAR KARMA CARD (Takes 3 columns) */}
                <div className="lg:col-span-3">
                   <KarmaCard stats={stats} loading={stats.loading} />
                </div>

                {/* 2. BADGES CARD (Takes 2 columns) */}
                <div className="lg:col-span-2">
                   <BadgesCard totalPoints={stats.points_total} />
                </div>
              
              </div>

              {/* 3. Heatmap */}
              <FocusHeatmap />
              
              {/* 4. History Chart */}
              <HistoryChart />
          </div>

        </div>
      </div>

      <ProfileModal 
        user={{...user, ...userData}} 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />

      {/* 🔥 FLOATING BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Clear History Button */}
        <button
          onClick={handleClearHistory}
          disabled={clearing}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm transition-all transform hover:scale-105"
        >
          <Trash2 size={20} />
          {clearing ? 'Clearing...' : '🗑️ Clear All History'}
        </button>

        {/* Seed Database Button */}
        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm transition-all transform hover:scale-105"
        >
          <Database size={20} />
          {seeding ? 'Seeding...' : '🚀 Generate Activity Data'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;