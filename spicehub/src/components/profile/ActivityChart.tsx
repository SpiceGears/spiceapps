"use client";

interface ActivityChartProps {
  monthlyData: number[];
  maxValue: number;
  year: number;
  currentYear: number;
  currentMonth: number;
}

// Month labels in Polish
export const monthNames = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

export function ActivityChart({ monthlyData, maxValue, year, currentYear, currentMonth }: ActivityChartProps) {
  return (
    <div className="flex h-[120px] relative mb-4">
      {/* Left axis with scale numbers */}
      <div className="w-8 absolute -left-2 h-full flex flex-col justify-between text-right pr-1">
        <span className="text-xs text-gray-500">{maxValue}</span>
        <span className="text-xs text-gray-500">{Math.round(maxValue / 2)}</span>
        <span className="text-xs text-gray-500">0</span>
      </div>
      
      {/* Chart with bars */}
      <div className="h-[120px] flex items-end gap-2 ml-6 w-full">
        {monthlyData.map((count, i) => {
          // Ensure bar height is visible but proportional
          const barHeight = count > 0 
            ? Math.max((count / maxValue) * 100, 10) 
            : 3;
          
          const isCurrentMonth = i === currentMonth && year === currentYear;
          
          return (
            <div 
              key={`month-${i}`} 
              className="flex flex-col items-center justify-end flex-1"
            >
              <div className="relative flex justify-center w-full">
                {count > 0 && (
                  <span className="text-[9px] text-gray-400 absolute -top-4">
                    {count}
                  </span>
                )}
                <div 
                  className={`w-full ${
                    count > 0 
                      ? isCurrentMonth
                        ? 'bg-blue-500' 
                        : 'bg-emerald-600'
                      : 'bg-[#242e43]'
                  } rounded-sm group`} 
                  style={{ height: `${barHeight}px` }}
                  title={`${count} aktywności w ${monthNames[i]}`}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">{monthNames[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
