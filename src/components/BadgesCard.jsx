import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

const BadgesCard = ({ totalPoints, activeDays = 0 }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const badges = [
    // Points-based badges
    { id: 1,  title: "Starter",    subtitle: "Initiated",      value: "10",  unlockAt: 10,  tier: "starter",  type: "points" },
    { id: 2,  title: "Focus 50",   subtitle: "Half Century",   value: "50",  unlockAt: 50,  tier: "silver",   type: "points" },
    { id: 3,  title: "Century",    subtitle: "Ascension",      value: "100", unlockAt: 100, tier: "gold",     type: "points" },
    { id: 4,  title: "Dedicated",  subtitle: "Unstoppable",    value: "200", unlockAt: 200, tier: "platinum", type: "points" },
    { id: 5,  title: "Spartan",    subtitle: "God Mode",       value: "300", unlockAt: 300, tier: "diamond",  type: "points" },
    // Active-days badges
    { id: 6,  title: "Monthly",      subtitle: "Consistency",   value: "30",  unlockAt: 30,  tier: "bronze",   type: "days" },
    { id: 7,  title: "Half Century", subtitle: "Endurance",     value: "50",  unlockAt: 50,  tier: "silver",   type: "days" },
    { id: 8,  title: "Centurion",    subtitle: "Relentless",    value: "100", unlockAt: 100, tier: "gold",     type: "days" },
    { id: 9,  title: "Veteran",      subtitle: "Iron Will",     value: "200", unlockAt: 200, tier: "platinum", type: "days" },
    { id: 10, title: "One Year",     subtitle: "Immortal",      value: "365", unlockAt: 365, tier: "diamond",  type: "days" },
    { id: 11, title: "Legend",       subtitle: "Transcended",   value: "500", unlockAt: 500, tier: "diamond",  type: "days" },
  ];

  const isBadgeUnlocked = (badge) => {
    if (badge.type === "days") return activeDays >= badge.unlockAt;
    return totalPoints >= badge.unlockAt;
  };

  const unlockedCount = badges.filter(isBadgeUnlocked).length;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#0a0a0a] p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] h-full flex flex-col overflow-hidden">
       
       {/* Header */}
       <div className="flex justify-between items-start mb-6 relative z-10">
         <div>
            <h2 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Trophy Room</h2>
            <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 tracking-tighter">
                  {unlockedCount}
                </span>
                <span className="text-white/30 text-xs font-bold uppercase tracking-widest">/ {badges.length} Unlocked</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
           <button 
             onClick={() => scroll(-1)} 
             className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-300 ${canScrollLeft ? 'hover:bg-white/10 hover:scale-105 opacity-100' : 'opacity-30 cursor-default'}`}
             disabled={!canScrollLeft}
           >
             <ChevronLeft size={16} className="text-white/60" />
           </button>
           <button 
             onClick={() => scroll(1)} 
             className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-300 ${canScrollRight ? 'hover:bg-white/10 hover:scale-105 opacity-100' : 'opacity-30 cursor-default'}`}
             disabled={!canScrollRight}
           >
             <ChevronRight size={16} className="text-white/60" />
           </button>
         </div>
       </div>

       {/* Badges Scroll Container */}
       <div className="relative mt-auto flex-1 flex items-end">
         {/* Left fade */}
         {canScrollLeft && (
           <div className="absolute top-0 left-0 w-10 h-full bg-gradient-to-r from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
         )}
         
         <div 
           ref={scrollRef}
           className="flex gap-4 overflow-x-auto pb-0 pt-2 scrollbar-hide scroll-smooth relative z-10 w-full"
         >
           {badges.map((badge) => (
              <AchievementBadge
                key={badge.id}
                tier={badge.tier}
                title={badge.title}
                subtitle={badge.subtitle}
                value={badge.value}
                isUnlocked={isBadgeUnlocked(badge)}
                badgeType={badge.type}
              />
           ))}
         </div>

         {/* Right fade */}
         {canScrollRight && (
           <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
         )}
       </div>


    </div>
  );
};

export default BadgesCard;