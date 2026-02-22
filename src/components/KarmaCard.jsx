import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const KarmaCard = ({ stats, loading }) => {
  const chartData = [
    { name: 'Hard', value: stats.points_hard, color: '#ec4899' },
    { name: 'Medium', value: stats.points_mod, color: '#a855f7' },
    { name: 'Easy', value: stats.points_easy, color: '#06b6d4' },
  ];

  const isEmpty = stats.points_total <= 0;
  const displayData = isEmpty ? [{ name: 'Empty', value: 1, color: 'rgba(255,255,255,0.05)' }] : chartData;

  return (
    <div className="relative bg-[#0a0a0a] rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col justify-between overflow-hidden group">
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>

      <h3 className="text-white/50 text-xs uppercase tracking-widest font-bold mb-6 relative z-10">Focus Distribution</h3>
      
      <div className="grid grid-cols-2 gap-6 items-center h-full relative z-10">
        
        <div className="w-full h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                  paddingAngle={6}
                >
                  {displayData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ filter: `drop-shadow(0px 0px 10px ${entry.color}80)` }} 
                    />
                  ))}
                  
                  <Label
                    value={loading ? "..." : stats.points_total}
                    position="center"
                    className="fill-white text-4xl font-black"
                    dy={-5}
                  />
                  <Label
                    value="Total Points"
                    position="center"
                    className="fill-white/40 text-[10px] font-bold uppercase tracking-widest"
                    dy={25}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
        </div>

        <div className="space-y-5">
            <StatRow label="Easy" value={stats.points_easy} color="text-[#06b6d4]" />
            <StatRow label="Medium" value={stats.points_mod} color="text-[#a855f7]" />
            <StatRow label="Hard" value={stats.points_hard} color="text-[#ec4899]" />
            
            <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-2">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Distraction</span>
                <div className="bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md">
                  <span className="text-xs font-black text-red-400">-{stats.points_dist}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

const StatRow = ({ label, value, color }) => (
    <div className="flex justify-between items-center group bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
        <p className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</p>
        <div className="flex items-baseline gap-1">
          <p className="text-xl font-black text-white leading-none">{value}</p>
          <span className="text-[9px] text-white/30 font-bold tracking-widest">PTS</span>
        </div>
    </div>
);

export default KarmaCard;