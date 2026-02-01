import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { LayoutDashboard, Loader2 } from 'lucide-react';
import useHistory from '../hooks/useHistory';

// Color levels for the heatmap
const COLORS = [
  '#3b3b3b', // Level 0: Empty/No activity
  '#0e4429', // Level 1: Light green
  '#006d32', // Level 2: Medium green
  '#26a641', // Level 3: Bright green
  '#39d353', // Level 4: Neon green
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  // Generate calendar data - "Current" shows last 12 months, other years show Jan-Dec
  const calendarData = useMemo(() => {
    const today = new Date();
    const isCurrentView = selectedYear === currentYear;

    const months = [];
    
    if (isCurrentView) {
      // Show last 12 months from today
      for (let i = 11; i >= 0; i--) {
        const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        
        const weeks = [];
        let currentWeek = new Array(7).fill(null);
        
        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
          const dayOfWeek = d.getDay();
          const dateStr = d.toISOString().split('T')[0];
          const isFuture = d > today;
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
      // Show full calendar year Jan-Dec
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(selectedYear, month, 1);
        const monthEnd = new Date(selectedYear, month + 1, 0);
        
        const weeks = [];
        let currentWeek = new Array(7).fill(null);
        
        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
          const dayOfWeek = d.getDay();
          const dateStr = d.toISOString().split('T')[0];
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
      <div className="bg-[#282828] p-3 sm:p-6 rounded-xl border border-gray-700 h-40 flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading Heatmap...
      </div>
    );
  }

  // Calculate total weeks for CSS grid
  const totalWeeks = calendarData.reduce((sum, month) => sum + month.weeks.length, 0);

  return (
    <div className="bg-[#282828] p-3 sm:p-4 md:p-6 rounded-xl border border-gray-900 shadow-xl w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end mb-3 sm:mb-6">
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-gray-200 flex items-center gap-2">
            <LayoutDashboard size={16} className="text-green-500 sm:w-5 sm:h-5" />
            Focus History
          </h3>
          <div className="text-[10px] sm:text-xs text-gray-400 mt-1">
            <span className="text-white font-bold">{totalActiveDays}</span> Active Days{' '}
            {selectedYear === currentYear ? 'in the past year' : `in ${selectedYear}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#1f1f1f] border border-gray-700 text-gray-200 text-xs sm:text-sm rounded-md px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year === currentYear ? 'Current' : year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CALENDAR GRID - USING FLEX FOR MONTHS WITH GAPS */}
      <div className="w-full">
        {/* Calendar container - flex with month gaps */}
        <div className="flex w-full gap-[6px]">
          {calendarData.map((month, monthIndex) => (
            <div 
              key={monthIndex}
              className="flex"
              style={{ 
                flex: month.weeks.length,
                gap: '2px',
              }}
            >
              {month.weeks.map((week, weekIndex) => (
                <div 
                  key={weekIndex} 
                  className="flex-1 flex flex-col"
                  style={{ gap: '2px' }}
                >
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      data-tooltip-id="heatmap-tooltip"
                      data-tooltip-content={day && !day.isFuture ? `${day.count} points on ${day.date}` : ''}
                      className="aspect-square w-full rounded-[1px] sm:rounded-[2px]"
                      style={{
                        backgroundColor: day 
                          ? (day.isFuture ? '#3b3b3b' : COLORS[day.level])
                          : 'transparent',
                        cursor: day && !day.isFuture ? 'pointer' : 'default',
                        opacity: day?.isFuture ? 0.3 : 1,
                        minWidth: '3px',
                        maxWidth: '12px',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Month labels at bottom */}
        <div className="flex w-full mt-1 gap-[6px]">
          {calendarData.map((month, monthIndex) => (
            <div
              key={month.name + monthIndex}
              className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-500 text-center truncate"
              style={{ 
                flex: month.weeks.length,
              }}
            >
              {month.name}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-wrap justify-between items-center mt-2 sm:mt-4 text-[8px] sm:text-[10px] text-gray-500 gap-2">
        <div>
          <span className="text-white font-semibold">{totalPoints}</span> points {selectedYear === currentYear ? 'in the past year' : `in ${selectedYear}`}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-[2px] sm:gap-1">
          <span className="hidden sm:inline">Less</span>
          {COLORS.map((color, index) => (
            <div
              key={index}
              className="w-[6px] h-[6px] sm:w-[8px] sm:h-[8px] md:w-[10px] md:h-[10px] rounded-[1px] sm:rounded-[2px]"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="hidden sm:inline">More</span>
        </div>
      </div>

      <Tooltip
        id="heatmap-tooltip"
        className="z-50 font-sans text-xs"
        style={{
          backgroundColor: '#111',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '6px',
        }}
      />
    </div>
  );
};

export default FocusHeatmap;