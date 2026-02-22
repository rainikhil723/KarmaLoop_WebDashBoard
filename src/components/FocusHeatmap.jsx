import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { LayoutDashboard, Loader2 } from 'lucide-react';
import useHistory from '../hooks/useHistory';

const COLORS = [
  'rgba(255,255,255,0.03)',
  '#581c87',
  '#7e22ce',
  '#a855f7',
  '#ec4899',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const FocusHeatmap = () => {
  const { historyData, loading } = useHistory();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const historyMap = useMemo(
    () => new Map(historyData.map(i => [i.date, i.count])),
    [historyData]
  );

  const yearOptions = useMemo(() => {
    if (historyData.length === 0) return [currentYear];
    const years = historyData.map(item => new Date(item.date).getFullYear());
    const minYear = Math.min(...years);
    const maxYear = currentYear;
    const list = [];
    for (let y = maxYear; y >= minYear; y -= 1) list.push(y);
    return list;
  }, [historyData, currentYear]);

  useEffect(() => {
    if (!yearOptions.includes(selectedYear)) {
      setSelectedYear(currentYear);
    }
  }, [yearOptions, selectedYear, currentYear]);

  const calendarData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isCurrentView = selectedYear === currentYear;

    const months = [];
    
    if (isCurrentView) {
      for (let i = 11; i >= 0; i--) {
        const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        
        const weeks = [];
        let currentWeek = new Array(7).fill(null);
        
        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
          const dayOfWeek = d.getDay();
          const dateStr = formatLocalDate(d);
          const todayStr = formatLocalDate(today);
          const isFuture = dateStr > todayStr;
          const points = historyMap.get(dateStr) || 0;
          
          let level = 0;
          if (points > 0 && points <= 3) level = 1;
          else if (points > 3 && points <= 6) level = 2;
          else if (points > 6 && points <= 10) level = 3;
          else if (points > 10) level = 4;
          
          currentWeek[dayOfWeek] = {
            date: dateStr,
            count: points,
            level: level,
            day: d.getDate(),
            isFuture: isFuture,
          };
          
          if (dayOfWeek === 6 || d.getTime() === monthEnd.getTime()) {
            weeks.push([...currentWeek]);
            currentWeek = new Array(7).fill(null);
          }
        }
        
        months.push({
          name: MONTHS[targetDate.getMonth()],
          weeks: weeks,
        });
      }
    } else {
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(selectedYear, month, 1);
        const monthEnd = new Date(selectedYear, month + 1, 0);
        
        const weeks = [];
        let currentWeek = new Array(7).fill(null);
        
        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
          const dayOfWeek = d.getDay();
          const dateStr = formatLocalDate(d);
          const points = historyMap.get(dateStr) || 0;
          
          let level = 0;
          if (points > 0 && points <= 3) level = 1;
          else if (points > 3 && points <= 6) level = 2;
          else if (points > 6 && points <= 10) level = 3;
          else if (points > 10) level = 4;
          
          currentWeek[dayOfWeek] = {
            date: dateStr,
            count: points,
            level: level,
            day: d.getDate(),
            isFuture: false,
          };
          
          if (dayOfWeek === 6 || d.getTime() === monthEnd.getTime()) {
            weeks.push([...currentWeek]);
            currentWeek = new Array(7).fill(null);
          }
        }
        
        months.push({
          name: MONTHS[month],
          weeks: weeks,
        });
      }
    }
    
    return months;
  }, [selectedYear, currentYear, historyMap]);

  const totalActiveDays = useMemo(() => {
    let count = 0;
    calendarData.forEach(month => {
      month.weeks.forEach(week => {
        week.forEach(day => {
          if (day && day.count > 0) count++;
        });
      });
    });
    return count;
  }, [calendarData]);

  const totalPoints = useMemo(() => {
    let sum = 0;
    calendarData.forEach(month => {
      month.weeks.forEach(week => {
        week.forEach(day => {
          if (day) sum += day.count;
        });
      });
    });
    return sum;
  }, [calendarData]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-40 flex items-center justify-center text-white/40 backdrop-blur-xl">
        <Loader2 className="animate-spin mr-3 text-pink-500" size={24} /> 
        <span className="font-semibold tracking-wide">Loading Heatmap...</span>
      </div>
    );
  }

  const totalWeeks = calendarData.reduce((sum, month) => sum + month.weeks.length, 0);

  return (
    <div className="relative bg-[#0a0a0a] p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100"></div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 relative z-10">
        <div>
          <h3 className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1 flex items-center gap-2">
            <LayoutDashboard size={14} className="text-purple-400" />
            Focus History
          </h3>
          <div className="text-2xl font-black text-white mt-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">{totalActiveDays}</span> 
            <span className="text-lg text-white/60 ml-2 font-bold tracking-tight">Active Days</span>
            <span className="text-sm font-medium text-white/30 ml-2">
              {selectedYear === currentYear ? 'in the past year' : `in ${selectedYear}`}
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-0">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white/5 border border-white/10 text-white/80 text-sm font-semibold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer backdrop-blur-md appearance-none hover:bg-white/10 transition-colors"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year} className="bg-[#111] text-white">
                {year === currentYear ? 'Current Year' : year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full relative z-10">
        <div className="flex w-full gap-[6px]">
          {calendarData.map((month, monthIndex) => (
            <div 
              key={monthIndex}
              className="flex"
              style={{ flex: month.weeks.length, gap: '4px' }}
            >
              {month.weeks.map((week, weekIndex) => (
                <div 
                  key={weekIndex} 
                  className="flex-1 flex flex-col"
                  style={{ gap: '4px' }}
                >
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      data-tooltip-id="heatmap-tooltip"
                      data-tooltip-content={day && !day.isFuture ? `${day.count} points on ${day.date}` : ''}
                      className="aspect-square w-full rounded-sm sm:rounded-[3px] transition-all duration-300 hover:scale-125 hover:z-10 hover:shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                      style={{
                        backgroundColor: day 
                          ? (day.isFuture ? 'rgba(255,255,255,0.02)' : COLORS[day.level])
                          : 'transparent',
                        cursor: day && !day.isFuture ? 'pointer' : 'default',
                        opacity: day?.isFuture ? 0.3 : 1,
                        minWidth: '4px',
                        maxWidth: '14px',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="flex w-full mt-3 gap-[6px]">
          {calendarData.map((month, monthIndex) => (
            <div
              key={month.name + monthIndex}
              className="text-[10px] font-bold text-white/40 text-center truncate uppercase tracking-wider"
              style={{ flex: month.weeks.length }}
            >
              {month.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-8 text-xs font-semibold text-white/50 relative z-10">
        <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <span className="text-white font-bold">{totalPoints}</span> Total Points
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <span className="text-[10px] uppercase tracking-wider mr-1">Less</span>
          {COLORS.map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-[3px]"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-[10px] uppercase tracking-wider ml-1">More</span>
        </div>
      </div>

      <Tooltip
        id="heatmap-tooltip"
        className="z-50 font-sans font-bold text-xs"
        style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          padding: '8px 14px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
};

export default FocusHeatmap;