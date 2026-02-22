import React from 'react';
import { ChevronRight } from 'lucide-react';

const BadgesCard = ({ totalPoints }) => {
  const badges = [
    { id: 1, name: "Starter", unlockAt: 10, colorFrom: "from-blue-500", colorTo: "to-cyan-400", shadow: "shadow-[0_0_20px_rgba(34,211,238,0.4)]", letter: "S" },
    { id: 2, name: "Focus 50", unlockAt: 50, colorFrom: "from-emerald-500", colorTo: "to-teal-400", shadow: "shadow-[0_0_20px_rgba(45,212,191,0.4)]", letter: "50" },
    { id: 3, name: "Century", unlockAt: 100, colorFrom: "from-orange-500", colorTo: "to-amber-400", shadow: "shadow-[0_0_20px_rgba(251,191,36,0.4)]", letter: "100" },
  ];

  const unlockedCount = badges.filter(b => totalPoints >= b.unlockAt).length;

  return (
    <div className="relative overflow-hidden bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col group">
       <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
       
       <div className="flex justify-between items-start mb-8 z-10">
         <div>
            <h2 className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1">Milestones</h2>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                  {unlockedCount}
                </span>
                <span className="text-white/40 text-sm font-medium">/ {badges.length} Unlocked</span>
            </div>
         </div>
         <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 hover:scale-110 transition-all duration-300">
            <ChevronRight size={18} className="text-white/70" />
         </button>
       </div>

       <div className="flex gap-5 mt-auto justify-start overflow-x-auto pb-2 scrollbar-hide z-10">
          {badges.map((badge) => {
             const isUnlocked = totalPoints >= badge.unlockAt;
             return (
               <div key={badge.id} className="relative flex-shrink-0 flex flex-col items-center gap-3">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${isUnlocked ? `bg-gradient-to-br ${badge.colorFrom} ${badge.colorTo} ${badge.shadow} shadow-2xl scale-100` : 'bg-white/5 border border-white/10 scale-95 opacity-50 grayscale'}`}>
                     <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl bg-black/20 backdrop-blur-md border border-white/20 shadow-inner">
                        {badge.letter}
                     </div>
                  </div>
                  <span className={`text-xs font-bold tracking-wide ${isUnlocked ? 'text-white/90' : 'text-white/30'}`}>
                     {badge.name}
                  </span>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export default BadgesCard;