import React from 'react';
import Navbar from '../components/Navbar';
import Leaderboard from '../components/Leaderboard';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import useLeaderboard from '../hooks/useLeaderboard';
import { useAuth } from '../context/AuthContext';

const Rankings = () => {
  const { user } = useAuth();
  const { leaderboard, loading } = useLeaderboard(100);

  // Get current user's rank
  const currentUserData = leaderboard.find(u => u.uid === user?.uid);
  const userRank = currentUserData?.rank || '--';

  // Get top 3 users
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <Navbar onPrint={() => window.print()} />

      <div className="pt-28 p-4 md:p-8">
        <div className="max-w-[1200px] mx-auto space-y-6">
          
          {/* Page Header */}
          <div className="text-center mb-8 md:mt-12 lg:mt-18">
            <div className="inline-flex items-center gap-3 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/30 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-400 font-semibold">Global Leaderboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              🏆 Rankings
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Compete with fellow learners and climb the ranks. The more you focus, the higher you rise!
            </p>
          </div>

          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
              {/* 2nd Place */}
              <div className="flex flex-col items-center order-1">
                <div className="relative mb-2">
                  <img
                    src={top3[1]?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[1]?.displayName}`}
                    alt={top3[1]?.displayName}
                    className="w-16 h-16 rounded-full border-4 border-gray-400 object-cover"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-400 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                </div>
                <Medal className="w-5 h-5 text-gray-400 mb-1" />
                <p className="text-sm font-semibold text-gray-300 truncate max-w-full">{top3[1]?.displayName}</p>
                <p className="text-xs text-gray-500">{top3[1]?.points_total} pts</p>
                <div className="h-20 w-full bg-gray-600/30 rounded-t-lg mt-2 flex items-end justify-center pb-2">
                  <span className="text-gray-400 text-xs">Silver</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center order-0 md:order-1 -mt-4">
                <div className="relative mb-2">
                  <img
                    src={top3[0]?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[0]?.displayName}`}
                    alt={top3[0]?.displayName}
                    className="w-20 h-20 rounded-full border-4 border-yellow-500 object-cover shadow-lg shadow-yellow-500/30"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                </div>
                <Crown className="w-6 h-6 text-yellow-500 mb-1" />
                <p className="text-sm font-bold text-yellow-400 truncate max-w-full">{top3[0]?.displayName}</p>
                <p className="text-xs text-gray-400">{top3[0]?.points_total} pts</p>
                <div className="h-28 w-full bg-yellow-500/20 rounded-t-lg mt-2 flex items-end justify-center pb-2 border border-yellow-500/30">
                  <span className="text-yellow-500 text-xs font-semibold">Champion</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center order-2">
                <div className="relative mb-2">
                  <img
                    src={top3[2]?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[2]?.displayName}`}
                    alt={top3[2]?.displayName}
                    className="w-16 h-16 rounded-full border-4 border-amber-600 object-cover"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                </div>
                <Award className="w-5 h-5 text-amber-600 mb-1" />
                <p className="text-sm font-semibold text-gray-300 truncate max-w-full">{top3[2]?.displayName}</p>
                <p className="text-xs text-gray-500">{top3[2]?.points_total} pts</p>
                <div className="h-16 w-full bg-amber-600/20 rounded-t-lg mt-2 flex items-end justify-center pb-2">
                  <span className="text-amber-600 text-xs">Bronze</span>
                </div>
              </div>
            </div>
          )}

          {/* Your Rank Card */}
          {currentUserData && (
            <div className="bg-[#282828] border border-gray-700 rounded-xl p-4 max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUserData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserData.displayName}`}
                    alt="You"
                    className="w-10 h-10 rounded-full border-2 border-green-500"
                  />
                  <div>
                    <p className="text-sm text-gray-400">Your Position</p>
                    <p className="text-white font-semibold">{currentUserData.displayName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">#{userRank}</p>
                  <p className="text-xs text-gray-500">{currentUserData.points_total} points</p>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Component */}
          <Leaderboard />

          {/* Footer Info */}
          <div className="text-center text-xs text-gray-600 mt-8">
            <p>Rankings are updated in real-time based on your karma points.</p>
            <p className="mt-1">Ties are broken by Hard Points → Moderate Points → Active Days</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Rankings;
