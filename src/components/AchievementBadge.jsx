import React from 'react';

const AchievementBadge = ({ tier, title, subtitle, isUnlocked, value, badgeType = 'points' }) => {
  const themes = {
    starter:  { base: "#1a1a1a", inner: "#1a1a1a", border: ["#4a5568", "#a0aec0"], accent: "#FF8C00", glow: "rgba(255,140,0,0.5)", spark: "#FFD700" },
    bronze:   { base: "#1a1a1a", inner: "#1a1a1a", border: ["#4a5568", "#a0aec0"], accent: "#e28b46", glow: "rgba(226,139,70,0.5)", spark: "#f5b982" },
    silver:   { base: "#1a1a1a", inner: "#1a1a1a", border: ["#4a5568", "#a0aec0"], accent: "#00FF66", glow: "rgba(0,255,102,0.5)", spark: "#ffffff" },
    gold:     { base: "#1a1a1a", inner: "#1a1a1a", border: ["#4a5568", "#a0aec0"], accent: "#FDE047", glow: "rgba(253,224,71,0.5)", spark: "#FEF08A" },
    platinum: { base: "#1a1a1a", inner: "#1a1a1a", border: ["#4a5568", "#a0aec0"], accent: "#06B6D4", glow: "rgba(6,182,212,0.5)", spark: "#A5F3FC" },
    diamond:  { base: "#1a1a1a", inner: "#1a1a1a", border: ["#4a5568", "#a0aec0"], accent: "#D946EF", glow: "rgba(217,70,239,0.5)", spark: "#F0ABFC" }
  };

  const theme = isUnlocked ? themes[tier] || themes.silver : { base: "#0f0f0f", inner: "#111", border: ["#1f1f1f", "#282828"], accent: "#282828", glow: "transparent", spark: "transparent" };
  const filterId = `bevel-${tier}-${value}`;
  const patternId = `stripes-${tier}-${value}`;
  const gradId = `border-${tier}-${value}`;

  return (
    <div className="relative flex flex-col items-center flex-shrink-0 w-[130px] min-w-[130px] select-none">
      
      {/* Badge SVG */}
      <div 
        className={`relative transition-all duration-500 ${isUnlocked ? 'hover:-translate-y-2 hover:scale-105 cursor-pointer' : ''}`}
        style={{ filter: isUnlocked ? `drop-shadow(0 8px 16px ${theme.glow})` : 'none' }}
      >
        {/* Sparkle decorations — contained inside the badge area */}
        {isUnlocked && (
          <>
            <svg className="absolute top-2 left-3 w-3 h-3 animate-pulse" style={{ color: theme.spark, animationDuration: '3s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
            </svg>
            <svg className="absolute bottom-4 right-2 w-3.5 h-3.5 animate-pulse" style={{ color: theme.spark, animationDuration: '2.5s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
            </svg>
          </>
        )}

        <svg viewBox="0 0 120 135" className={`w-28 h-[126px] ${!isUnlocked ? 'opacity-25 grayscale' : ''}`}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.border[1]} />
              <stop offset="50%" stopColor={theme.border[0]} />
              <stop offset="100%" stopColor={theme.border[1]} />
            </linearGradient>

            <pattern id={patternId} width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill={theme.base} />
              <line x1="0" y1="0" x2="0" y2="6" stroke={theme.accent} strokeWidth="3" />
            </pattern>

            <clipPath id={`clip-${tier}-${value}`}>
              <path d="M60 5 L110 33.8 L110 91.2 L60 120 L10 91.2 L10 33.8 Z" />
            </clipPath>

            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>

          <g filter={`url(#${filterId})`}>
            {/* Outer hexagon border */}
            <path 
              d="M60 5 L110 33.8 L110 91.2 L60 120 L10 91.2 L10 33.8 Z" 
              fill={theme.base}
              stroke={`url(#${gradId})`}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            
            {/* Inner hexagon */}
            <path 
              d="M60 14 L102 37 L102 88 L60 111 L18 88 L18 37 Z" 
              fill={theme.inner}
              stroke={theme.border[0]}
              strokeWidth="0.5"
              strokeLinejoin="round"
              opacity="0.8"
            />
          </g>

          {/* Type label */}
          {isUnlocked && (
            <text 
              x="20" 
              y="62" 
              fill={theme.border[1]} 
              fontSize="11" 
              fontWeight="900" 
              letterSpacing="1"
              opacity="0.6"
              className="font-sans uppercase"
              transform="rotate(-90 20 62)"
            >
              {badgeType === 'days' ? 'DAYS' : 'PTS'}
            </text>
          )}

          {/* Main value number */}
          {isUnlocked && (
             <text 
               x="65" 
               y="82" 
               textAnchor="middle" 
               fill={`url(#${patternId})`}
               fontSize="64" 
               fontWeight="900" 
               className="font-black"
               letterSpacing="-3"
             >
               {value}
             </text>
          )}

          {/* Locked icon for locked badges */}
          {!isUnlocked && (
            <text 
              x="60" 
              y="75"
              textAnchor="middle"
              fontSize="32"
              fill="#333"
            >
              🔒
            </text>
          )}

          {/* Checkmark */}
          {isUnlocked && (
            <g transform="translate(48, 100) scale(0.22)">
              <polyline 
                points="32,55 45,68 70,36" 
                fill="none" 
                stroke={theme.accent} 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </g>
          )}
        </svg>
      </div>
      
      {/* Labels */}
      <div className="mt-2 flex flex-col items-center gap-0.5 w-full px-1">
        <span 
          className={`text-[11px] font-black uppercase tracking-wider text-center leading-tight ${isUnlocked ? 'opacity-100' : 'opacity-30'}`} 
          style={{ color: isUnlocked ? theme.border[1] : '#555' }}
        >
          {title}
        </span>
        <span className={`text-[8px] font-semibold uppercase tracking-wider text-center ${isUnlocked ? 'text-white/35' : 'text-white/10'}`}>
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default AchievementBadge;