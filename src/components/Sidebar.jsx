import React from 'react';
import { MapPin, Github, Linkedin, Globe, Twitter, Trophy, Clock, Activity, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userData, userRank, hoursStudied }) => {
  const data = userData || {};

  const getRankTheme = (rankName) => {
    const r = rankName?.toLowerCase() || "";
    if (r.includes("grandmaster")) return { bg: "from-purple-500 to-indigo-600", border: "border-purple-500/50", glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]" };
    if (r.includes("master")) return { bg: "from-pink-500 to-rose-600", border: "border-pink-500/50", glow: "shadow-[0_0_30px_rgba(236,72,153,0.4)]" };
    if (r.includes("apprentice")) return { bg: "from-cyan-400 to-blue-500", border: "border-cyan-400/50", glow: "shadow-[0_0_30px_rgba(34,211,238,0.4)]" };
    return { bg: "from-gray-600 to-gray-800", border: "border-white/20", glow: "shadow-none" };
  };

  const theme = getRankTheme(data.rank);

  return (
    <div className="relative bg-[#0a0a0a] rounded-3xl p-8 h-fit border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] col-span-1 overflow-hidden group">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/10 via-purple-500/5 to-transparent blur-[60px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100"></div>

      <div className="flex flex-col items-center text-center relative z-10">
        
        <div className="relative mb-6">
             <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.bg} blur-md opacity-50`}></div>
             <img 
               src={data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.displayName || 'Guest'}`} 
               alt="Avatar" 
               className={`relative w-28 h-28 rounded-full border-4 border-[#0a0a0a] object-cover ring-2 ring-offset-4 ring-offset-[#0a0a0a] ${theme.border} ${theme.glow} transition-all duration-500 hover:scale-105`}
             />
             <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-[3px] border-[#0a0a0a] shadow-[0_0_10px_rgba(34,197,94,0.6)] z-10" title="Online"></div>
        </div>
        
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 tracking-tight">
          {data.displayName || "Operator"}
        </h2>
        
        <div className="flex items-center gap-2 mt-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
          <ShieldCheck size={14} className="text-white/40" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{data.rank || "Novice"}</p>
        </div>
        
        {data.show_bio && data.bio && (
             <p className="text-white/40 text-sm mt-5 leading-relaxed font-medium max-w-[250px] mx-auto">
               {data.bio}
             </p>
        )}
        
        <Link 
          to="/rankings" 
          className="mt-8 w-full bg-gradient-to-r from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 border border-white/10 py-3.5 rounded-xl font-black flex items-center justify-center gap-3 text-white/50 hover:text-white transition-all shadow-inner group/btn"
        >
          <Trophy size={18} className="text-pink-500 group-hover/btn:scale-110 transition-transform" />
          <span className="uppercase tracking-widest text-xs">Global Position:</span>
          <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">#{userRank || '--'}</span>
        </Link>
      </div>

      <div className="mt-8 space-y-4 text-sm font-semibold text-white/50 relative z-10">
        
        {data.show_location && data.location && (
            <div className="flex items-center gap-4 group/link">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:bg-white/10 transition-colors">
                  <MapPin size={16} className="text-cyan-400" />
                </div>
                <span className="group-hover/link:text-white transition-colors">{data.location}</span>
            </div>
        )}

        {data.show_website && data.website && (
            <div className="flex items-center gap-4 group/link">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:bg-white/10 transition-colors">
                  <Globe size={16} className="text-purple-400" />
                </div>
                <a href={data.website} target="_blank" rel="noreferrer" className="group-hover/link:text-white transition-colors truncate">
                  {data.website.replace(/^https?:\/\//, '')}
                </a>
            </div>
        )}

        {data.show_github && data.github && (
            <div className="flex items-center gap-4 group/link">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:bg-white/10 transition-colors">
                  <Github size={16} className="text-white" />
                </div>
                <span className="group-hover/link:text-white transition-colors truncate">@{data.github}</span>
            </div>
        )}

        {data.show_linkedin && data.linkedin && (
            <div className="flex items-center gap-4 group/link">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:bg-white/10 transition-colors">
                  <Linkedin size={16} className="text-blue-500" />
                </div>
                <span className="group-hover/link:text-white transition-colors truncate">/in/{data.linkedin}</span>
            </div>
        )}

        {data.show_twitter && data.twitter && (
            <div className="flex items-center gap-4 group/link">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:bg-white/10 transition-colors">
                  <Twitter size={16} className="text-sky-400" />
                </div>
                <span className="group-hover/link:text-white transition-colors truncate">@{data.twitter}</span>
            </div>
        )}
      </div>

      <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-5 relative z-10 backdrop-blur-md">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
          <Activity size={12} /> System Metrics
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-purple-400" /> Active Log
            </span>
            <span className="text-white font-black text-lg">{hoursStudied || 0}<span className="text-[10px] text-white/30 ml-1">HRS</span></span>
          </div>
          <div className="h-px w-full bg-white/5"></div>
          <div className="flex justify-between items-center">
            <span className="text-white/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Trophy size={14} className="text-yellow-400" /> Standing
            </span>
            <span className="text-white font-black text-lg">#{userRank || '--'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;