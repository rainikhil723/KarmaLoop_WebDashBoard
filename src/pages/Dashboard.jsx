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
import { useDevAuth } from '../context/DevAuthContext'; // 🔐 Dev mode gating

const Dashboard = () => {
  const { user } = useAuth();
  const { isDevMode } = useDevAuth(); // 🔐 Only show dev buttons when unlocked
  const stats = useUserStats();
  const { leaderboard } = useLeaderboard(100);
  useHistorySync(user, stats);
  
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);

  const currentUserData = leaderboard.find(u => u.uid === user?.uid);
  const userRank = currentUserData?.rank || null;
  const hoursStudied = currentUserData?.hours_studied || 0;

  const handleSeedDatabase = async () => {
    if (window.confirm('Generate 1 year of fake activity data? This will populate your heatmap!')) {
      setSeeding(true);
      await seedDatabase(user.uid);
      setSeeding(false);
    }
  };

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
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <Navbar onPrint={() => window.print()} />

      <div className="pt-28 sm:pt-32 pb-16 px-3 sm:px-4 md:px-8 flex justify-center relative z-10">
        <div className="max-w-[1400px] w-full grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          <div className="col-span-1">
              <Sidebar 
                userData={{...userData, karma: stats.points_total, rank: stats.rank}} 
                userRank={userRank}
                hoursStudied={hoursStudied}
              />
          </div>

          <div className="col-span-1 xl:col-span-3 space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                   <KarmaCard stats={stats} loading={stats.loading} />
                </div>
                <div className="lg:col-span-2">
                   <BadgesCard totalPoints={stats.points_total} activeDays={stats.activeDays} />
                </div>
              </div>

              <FocusHeatmap />
              <HistoryChart />
          </div>

        </div>
      </div>

      <ProfileModal 
        user={{...user, ...userData}} 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />

      {/* 🔐 DEV ONLY: These buttons are hidden unless developer mode is unlocked via Settings */}
      {isDevMode && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 backdrop-blur-md text-red-400 px-6 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.2)] flex items-center gap-3 font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:scale-100"
          >
            <Trash2 size={18} />
            {clearing ? 'Purging...' : 'Purge Logs'}
          </button>

          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white px-6 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(236,72,153,0.3)] flex items-center gap-3 font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:scale-100"
          >
            <Database size={18} />
            {seeding ? 'Synthesizing...' : 'Synthesize Data'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;