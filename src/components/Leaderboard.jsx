import React, { useState } from 'react';
import { Trophy, Medal, Crown, MapPin, Calendar, Clock, ChevronDown, ChevronUp, Flame, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useLeaderboard from '../hooks/useLeaderboard';

const Leaderboard = () => {
  const { user } = useAuth();
  const { leaderboard, loading } = useLeaderboard(100);
  const [isExpanded, setIsExpanded] = useState(true);

  const currentUserRank = leaderboard.find(u => u.uid === user?.uid);
  const displayedUsers = isExpanded ? leaderboard : leaderboard.slice(0, 5);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-white/30 font-black text-sm bg-white/5 rounded-full border border-white/10">#{rank}</span>;
    }
  };

  const getRankStyle = (rank) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-l-yellow-400 border-y border-y-white/5 border-r border-r-white/5';
      case 2: return 'bg-gradient-to-r from-gray-300/10 to-transparent border-l-4 border-l-gray-300 border-y border-y-white/5 border-r border-r-white/5';
      case 3: return 'bg-gradient-to-r from-amber-600/10 to-transparent border-l-4 border-l-amber-600 border-y border-y-white/5 border-r border-r-white/5';
      default: return 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl';
    }
  };

  const getTierBadge = (points) => {
    if (points > 1000) return { name: 'Grandmaster', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    if (points > 200) return { name: 'Master', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' };
    if (points > 50) return { name: 'Apprentice', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    return { name: 'Novice', color: 'text-white/40 bg-white/5 border-white/10' };
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-6 h-6 text-[#a0aec0]" />
          <h3 className="text-xl font-black text-white tracking-tight">Global Rankings</h3>
        </div>
        <div className="flex items-center justify-center h-48 text-white/40">
          <Loader2 className="animate-spin mr-3 text-pink-500" size={24} /> 
          <span className="font-semibold tracking-wide">Syncing Leaderboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-500/5 via-purple-500/5 to-transparent blur-[100px] pointer-events-none"></div>

      <div className="p-6 sm:p-8 border-b border-white/10 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[#a0aec0]" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">Global Rankings</h3>
            <p className="text-sm font-semibold text-white/40 mt-0.5">{leaderboard.length} elite members active</p>
          </div>
        </div>
        
        {currentUserRank && (
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Your Rank</span>
            <span className="text-lg font-black text-[#a0aec0]">#{currentUserRank.rank}</span>
          </div>
        )}
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest relative z-10">
        <div className="col-span-1">Rank</div>
        <div className="col-span-4">Operator</div>
        <div className="col-span-2 text-center">Score</div>
        <div className="col-span-2 text-center">Time Logged</div>
        <div className="col-span-2 text-center">Consistency</div>
        <div className="col-span-1 text-center">Sector</div>
      </div>

      <div className="flex flex-col gap-2 p-3 sm:p-4 md:p-6 relative z-10">
        {displayedUsers.map((rankedUser) => {
          const isCurrentUser = rankedUser.uid === user?.uid;
          const tier = getTierBadge(rankedUser.points_total);
          
          return (
            <div
              key={rankedUser.uid}
              className={`grid grid-cols-12 gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 items-center transition-all duration-300 ${
                isCurrentUser 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-4 border-l-cyan-400 border-y border-y-cyan-500/20 border-r border-r-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : getRankStyle(rankedUser.rank)
              }`}
            >
              <div className="col-span-2 md:col-span-1 flex items-center justify-center md:justify-start">
                {getRankIcon(rankedUser.rank)}
              </div>

              <div className="col-span-7 md:col-span-4 flex items-center gap-4">
                <div className="relative">
                  <img
                    src={rankedUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rankedUser.displayName}`}
                    alt={rankedUser.displayName}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-lg ${
                      rankedUser.rank === 1 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0a0a0a]' :
                      rankedUser.rank === 2 ? 'ring-2 ring-gray-300 ring-offset-2 ring-offset-[#0a0a0a]' :
                      rankedUser.rank === 3 ? 'ring-2 ring-amber-600 ring-offset-2 ring-offset-[#0a0a0a]' :
                      'border border-white/10'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p className={`font-black text-sm sm:text-base truncate tracking-tight ${isCurrentUser ? 'text-cyan-400' : 'text-white'}`}>
                    {rankedUser.displayName}
                    {isCurrentUser && <span className="text-xs text-cyan-500/50 ml-2 uppercase tracking-widest">(You)</span>}
                  </p>
                  <span className={`inline-block text-[9px] px-2 py-0.5 mt-1 rounded-md border font-bold uppercase tracking-wider ${tier.color}`}>
                    {tier.name}
                  </span>
                </div>
              </div>

              <div className="col-span-3 md:col-span-2 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-pink-500" />
                  <span className="text-white font-black text-lg">{rankedUser.points_total}</span>
                </div>
                <div className="text-[9px] font-bold text-white/30 hidden md:block mt-0.5 uppercase tracking-widest">
                  H:{rankedUser.points_hard} M:{rankedUser.points_mod} E:{rankedUser.points_easy}
                </div>
              </div>

              <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                <div className="flex items-baseline gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white font-black text-sm">{rankedUser.hours_studied}</span>
                  <span className="text-[10px] font-bold text-white/40">HRS</span>
                </div>
              </div>

              <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                <div className="flex items-baseline gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white font-black text-sm">{rankedUser.active_days}</span>
                  <span className="text-[10px] font-bold text-white/40">DAYS</span>
                </div>
              </div>

              <div className="hidden md:flex col-span-1 justify-center">
                {rankedUser.location ? (
                  <div className="group relative">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 hover:scale-110 transition-all cursor-pointer">
                      <MapPin className="w-4 h-4 text-white/50 group-hover:text-pink-400" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-10 shadow-xl">
                      {rankedUser.location}
                    </div>
                  </div>
                ) : (
                  <span className="text-white/20 font-bold">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors border-t border-white/5 flex items-center justify-center gap-2 text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest relative z-10"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Collapse View
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              View Complete Roster ({leaderboard.length})
            </>
          )}
        </button>
      )}

      {leaderboard.length === 0 && !loading && (
        <div className="p-12 text-center relative z-10">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 rotate-12">
            <Trophy className="w-10 h-10 text-white/20" />
          </div>
          <h4 className="text-xl font-black text-white mb-2">The Board is Empty</h4>
          <p className="text-sm font-semibold text-white/40">Be the first pioneer to claim the top spot.</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;