import React from 'react';
import { ChevronRight } from 'lucide-react';

const BadgesCard = ({ totalPoints }) => {
  
  // 3D Badge Data
  const badges = [
    { 
      id: 1, name: "Starter", unlockAt: 10, 
      colorFrom: "from-blue-400", colorTo: "to-blue-600", 
      shadow: "shadow-blue-500/50", letter: "S" 
    },
    { 
      id: 2, name: "Focus 50", unlockAt: 50, 
      colorFrom: "from-emerald-400", colorTo: "to-emerald-600", 
      shadow: "shadow-emerald-500/50", letter: "50" 
    },
    { 
      id: 3, name: "Century", unlockAt: 100, 
      colorFrom: "from-amber-400", colorTo: "to-amber-600", 
      shadow: "shadow-amber-500/50", letter: "100" 
    },
  ];

  const unlockedCount = badges.filter(b => totalPoints >= b.unlockAt).length;

  return (
    <div className="bg-[#282828] p-5 rounded-xl border border-gray-700 shadow-xl h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
         <div>
            <span className="text-gray-400 text-sm font-medium">Badges</span>
            <div className="text-2xl font-bold text-white mt-1">{unlockedCount}</div>
         </div>
         <ChevronRight size={20} className="text-gray-500 cursor-pointer hover:text-white transition"/>
       </div>

       {/* 3D Badges Container */}
       <div className="flex gap-4 mt-2 justify-start overflow-x-auto pb-4 custom-scrollbar">
          {badges.map((badge) => {
             const isUnlocked = totalPoints >= badge.unlockAt;
             return (
               <div key={badge.id} className="relative group perspective-1000">
                  
                  {/* THE 3D BADGE */}
                  <div className={`
                    w-20 h-24 rounded-lg flex items-center justify-center 
                    transition-all duration-500 transform-style-3d group-hover:rotate-y-12
                    ${isUnlocked 
                        ? `bg-gradient-to-br ${badge.colorFrom} ${badge.colorTo} ${badge.shadow} shadow-lg` 
                        : 'bg-[#3a3a3a] border border-gray-600 opacity-40 grayscale'}
                    relative overflow-hidden
                  `}>
                     
                     {/* Glossy Reflection Effect */}
                     {isUnlocked && (
                         <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 skew-y-12 transform -translate-y-4"></div>
                     )}

                     {/* Inner Circle / Content */}
                     <div className={`
                        w-14 h-14 rounded-full bg-[#1a1a1a]/20 backdrop-blur-sm 
                        flex items-center justify-center border border-white/30
                        text-white font-bold text-lg shadow-inner
                     `}>
                        {badge.letter}
                     </div>

                     {/* Bottom Thickness (Fake 3D Depth) */}
                     {isUnlocked && (
                        <div className="absolute bottom-0 w-full h-1 bg-black/30"></div>
                     )}
                  </div>

                  {/* Tooltip Name */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                     {badge.name}
                  </div>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export default BadgesCard;