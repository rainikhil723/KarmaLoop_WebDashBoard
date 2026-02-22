import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useHistory from '../hooks/useHistory';

const HistoryChart = () => {
  const { historyData } = useHistory();

  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    const historyMap = new Map(historyData.map(i => [i.date, i.count]));

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      days.push({
        name: dayName,
        fullDate: dateStr,
        points: historyMap.get(dateStr) || 0
      });
    }
    return days;
  };

  const chartData = getLast7Days();

  return (
    <div className="relative bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mt-6 overflow-hidden group">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-end mb-8 relative z-10">
          <div>
              <h3 className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1">Performance</h3>
              <h2 className="text-2xl font-black text-white">Activity Graph</h2>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Last 7 Days
              </span>
          </div>
      </div>
      
      <div className="h-80 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.2)" 
                tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600}} 
                axisLine={false}
                tickLine={false}
                dy={15}
            />
            <YAxis 
                stroke="rgba(255,255,255,0.2)" 
                tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600}} 
                axisLine={false}
                tickLine={false}
                dx={-15}
            />
            
            <Tooltip 
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                      <p className="text-white/40 text-xs font-bold tracking-wider mb-2 uppercase">
                        {payload[0].payload.fullDate}
                      </p>
                      <div className="flex items-baseline gap-1">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-black text-3xl">
                            {payload[0].value}
                          </span>
                          <span className="text-xs font-bold text-white/50">pts</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="points" 
              stroke="url(#lineGradient)" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorPoints)" 
              activeDot={{ r: 8, strokeWidth: 0, fill: '#fff', style: { filter: 'drop-shadow(0px 0px 8px rgba(236,72,153,0.8))' } }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;