import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useHistory from '../hooks/useHistory';

const HistoryChart = () => {
  const { historyData } = useHistory();

  // Get Last 7 Days Data
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    // Create map for easy lookup
    const historyMap = new Map(historyData.map(i => [i.date, i.count]));

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"
      
      days.push({
        name: dayName,
        fullDate: dateStr,
        points: historyMap.get(dateStr) || 0 // Default to 0 if no record (Dynamic Reset)
      });
    }
    return days;
  };

  const chartData = getLast7Days();

  return (
    <div className="bg-[#282828] p-6 rounded-xl border border-gray-700 shadow-xl mt-6">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-200">Activity Graph</h3>
          <span className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full border border-gray-600">Last 7 Days</span>
      </div>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            
            <XAxis 
                dataKey="name" 
                stroke="#666" 
                tick={{fill: '#888', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
                dy={10}
            />
            <YAxis 
                stroke="#666" 
                tick={{fill: '#888', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
                dx={-10}
            />
            
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1f1f1f] border border-[#444] p-3 rounded-lg shadow-xl">
                      <p className="text-gray-400 text-xs mb-1">{payload[0].payload.fullDate}</p>
                      <p className="text-[#eab308] font-bold text-lg">
                        {payload[0].value} <span className="text-xs font-normal text-gray-500">pts</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="points" 
              stroke="#eab308" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPoints)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;