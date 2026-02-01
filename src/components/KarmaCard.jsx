import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const KarmaCard = ({ stats, loading }) => {
  
  // Integer Data for Chart
  const chartData = [
    { name: 'Hard', value: stats.points_hard, color: '#ef4444' },    // Red
    { name: 'Medium', value: stats.points_mod, color: '#eab308' },   // Yellow
    { name: 'Easy', value: stats.points_easy, color: '#00b8a3' },    // Teal
  ];

  // Agar user ka data 0 hai, to grey ring dikhayenge
  const isEmpty = stats.points_total <= 0;
  const displayData = isEmpty ? [{ name: 'Empty', value: 1, color: '#333' }] : chartData;

  return (
    <div className="bg-[#282828] rounded-xl p-6 border border-gray-700 shadow-xl h-full flex flex-col justify-between">
      <h3 className="text-gray-200 font-bold text-lg mb-2">Focus Distribution</h3>
      
      <div className="grid grid-cols-2 gap-4 items-center h-full">
        
        {/* LEFT: 3D-ish Donut Chart */}
        <div className="w-full h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80} // Thoda mota ring
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6} // 🟢 Rounded Ends (Professional Look)
                  paddingAngle={5} // Gaps between sections
                >
                  {displayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={0} style={{filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.5))'}} />
                  ))}
                  
                  {/* Center Text */}
                  <Label
                    value={loading ? "..." : stats.points_total}
                    position="center"
                    className="fill-white text-3xl font-extrabold"
                    dy={-5}
                  />
                  <Label
                    value="Total Points"
                    position="center"
                    className="fill-gray-500 text-xs font-medium"
                    dy={20}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
        </div>

        {/* RIGHT: Detailed Stats List */}
        <div className="space-y-4">
            <StatRow label="Easy" value={stats.points_easy} color="text-[#00b8a3]" />
            <StatRow label="Medium" value={stats.points_mod} color="text-[#eab308]" />
            <StatRow label="Hard" value={stats.points_hard} color="text-[#ef4444]" />
            
            {/* Distraction (Negative) */}
            <div className="pt-2 border-t border-gray-700 flex justify-between items-center opacity-80">
                <span className="text-xs text-gray-500 font-medium">Distraction</span>
                <span className="text-sm font-bold text-rose-400">-{stats.points_dist}</span>
            </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component for cleaner code
const StatRow = ({ label, value, color }) => (
    <div className="flex justify-between items-end group">
        <div>
            <p className={`text-xs font-medium ${color} mb-0.5`}>{label}</p>
            <p className="text-xl font-bold text-white leading-none">{value}</p>
        </div>
        <span className="text-[10px] text-gray-600 font-mono mb-1">PTS</span>
    </div>
);

export default KarmaCard;