import React, { useState } from 'react';
import { Trophy, Medal, Crown, MapPin, Calendar, Clock, ChevronDown, ChevronUp, Flame, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useLeaderboard from '../hooks/useLeaderboard';

const Leaderboard = () => {
  const { user } = useAuth();
  const { leaderboard, loading } = useLeaderboard(100);
  const [isExpanded, setIsExpanded] = useState(true); // Default expanded on Rankings page

  // Find current user's rank
  const currentUserRank = leaderboard.find(u => u.uid === user?.uid);

  // Show top 5 when collapsed, all when expanded
  const displayedUsers = isExpanded ? leaderboard : leaderboard.slice(0, 5);

  // Get rank icon based on position
  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold text-sm">#{rank}</span>;
    }
  };

  // Get rank badge style
  const getRankStyle = (rank) => {
    switch(rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/50';
      default:
        return 'bg-[#1f1f1f] border-gray-700 hover:border-gray-600';
    }
  };

  // Get tier badge based on points
  const getTierBadge = (points) => {
    if (points > 1000) return { name: 'Grandmaster', color: 'text-purple-400 bg-purple-500/20' };
    if (points > 200) return { name: 'Master', color: 'text-yellow-400 bg-yellow-500/20' };
    if (points > 50) return { name: 'Apprentice', color: 'text-blue-400 bg-blue-500/20' };
    return { name: 'Novice', color: 'text-gray-400 bg-gray-500/20' };
  };

  if (loading) {
    return (
      <div className="bg-[#282828] p-6 rounded-xl border border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-white">Global Rankings</h3>
        </div>
        <div className="flex items-center justify-center h-40 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Loading rankings...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#282828] rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Global Rankings</h3>
              <p className="text-xs text-gray-500">{leaderboard.length} active users</p>
            </div>
          </div>
          
          {/* Current user's rank badge */}
          {currentUserRank && (
            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
              <span className="text-xs text-gray-400">Your Rank:</span>
              <span className="text-green-400 font-bold">#{currentUserRank.rank}</span>
            </div>
          )}
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 bg-[#1f1f1f] text-xs text-gray-500 uppercase tracking-wider border-b border-gray-700">
        <div className="col-span-1">Rank</div>
        <div className="col-span-4">User</div>
        <div className="col-span-2 text-center">Points</div>
        <div className="col-span-2 text-center">Hours</div>
        <div className="col-span-2 text-center">Active</div>
        <div className="col-span-1 text-center">Region</div>
      </div>

      {/* Leaderboard List */}
      <div className="divide-y divide-gray-700/50">
        {displayedUsers.map((rankedUser, index) => {
          const isCurrentUser = rankedUser.uid === user?.uid;
          const tier = getTierBadge(rankedUser.points_total);
          
          return (
            <div
              key={rankedUser.uid}
              className={`grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 sm:py-4 items-center transition-all ${
                isCurrentUser 
                  ? 'bg-green-500/10 border-l-2 border-green-500' 
                  : getRankStyle(rankedUser.rank)
              } ${rankedUser.rank <= 3 ? 'border-l-2' : ''}`}
            >
              {/* Rank */}
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                {getRankIcon(rankedUser.rank)}
              </div>

              {/* User Info */}
              <div className="col-span-7 sm:col-span-4 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={rankedUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rankedUser.displayName}`}
                    alt={rankedUser.displayName}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 ${
                      rankedUser.rank === 1 ? 'border-yellow-500' :
                      rankedUser.rank === 2 ? 'border-gray-400' :
                      rankedUser.rank === 3 ? 'border-amber-600' :
                      'border-gray-600'
                    }`}
                  />
                  {rankedUser.rank <= 3 && (
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                      rankedUser.rank === 1 ? 'bg-yellow-500 text-black' :
                      rankedUser.rank === 2 ? 'bg-gray-400 text-black' :
                      'bg-amber-600 text-white'
                    }`}>
                      {rankedUser.rank}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`font-semibold truncate text-sm ${isCurrentUser ? 'text-green-400' : 'text-white'}`}>
                    {rankedUser.displayName}
                    {isCurrentUser && <span className="text-xs text-gray-500 ml-1">(You)</span>}
                  </p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${tier.color}`}>
                    {tier.name}
                  </span>
                </div>
              </div>

              {/* Points */}
              <div className="col-span-3 sm:col-span-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-white font-bold text-sm">{rankedUser.points_total}</span>
                </div>
                <div className="text-[10px] text-gray-500 hidden sm:block">
                  H:{rankedUser.points_hard} M:{rankedUser.points_mod} E:{rankedUser.points_easy}
                </div>
              </div>

              {/* Hours Studied */}
              <div className="hidden sm:flex col-span-2 flex-col items-center">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span className="text-white font-medium text-sm">{rankedUser.hours_studied}h</span>
                </div>
                <span className="text-[10px] text-gray-500">studied</span>
              </div>

              {/* Active Days */}
              <div className="hidden sm:flex col-span-2 flex-col items-center">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-green-400" />
                  <span className="text-white font-medium text-sm">{rankedUser.active_days}</span>
                </div>
                <span className="text-[10px] text-gray-500">days</span>
              </div>

              {/* Region */}
              <div className="hidden sm:flex col-span-1 justify-center">
                {rankedUser.location ? (
                  <div className="group relative">
                    <MapPin className="w-4 h-4 text-gray-500 cursor-pointer hover:text-green-400" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {rankedUser.location}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {leaderboard.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-green-400 hover:bg-[#1f1f1f] transition-all border-t border-gray-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All ({leaderboard.length} users)
            </>
          )}
        </button>
      )}

      {/* Empty State */}
      {leaderboard.length === 0 && !loading && (
        <div className="p-8 text-center text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No users on the leaderboard yet.</p>
          <p className="text-sm">Be the first to earn some karma!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
