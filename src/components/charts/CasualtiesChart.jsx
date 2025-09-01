import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CasualtiesChart = ({ data = [], isLoading = false }) => {
  // Fallback data if no data provided
  const chartData = useMemo(() => (
    (data && data.length > 0 ? data : [
      { name: 'KP', value: 190, color: '#f97316' },
      { name: 'Balochistan', value: 184, color: '#ef4444' },
      { name: 'Sindh', value: 114, color: '#eab308' },
      { name: 'Punjab', value: 71, color: '#22c55e' }
    ]).map((d) => ({ ...d, value: Number(d.value) || 0 }))
  ), [data]);

  const totalValue = useMemo(
    () => chartData.reduce((sum, d) => sum + (Number(d.value) || 0), 0),
    [chartData]
  );

  const [activeIndex, setActiveIndex] = useState(-1);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const { name, value, payload: item } = payload[0] || {};
    const percent = totalValue > 0 ? Math.round((value / totalValue) * 100) : 0;
    return (
      <div
        className="rounded-xl shadow-lg border"
        style={{
          backgroundColor: '#0F0F10',
          borderColor: '#1f2937',
          padding: '10px 12px',
          minWidth: 140
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: item?.color || '#8884d8' }}
          />
          <span className="text-xs" style={{ color: '#9CA3AF' }}>{name}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-base font-semibold" style={{ color: '#F3F4F6' }}>{value?.toLocaleString?.() ?? value}</span>
          <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{percent}%</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="border border-gray-800 rounded-lg p-6" style={{ backgroundColor: '#262626' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white ">Casualties by Region</h2>
          <div className="text-sm text-gray-400">Regional Analysis</div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-800 rounded-2xl p-6" style={{ backgroundColor: '#262626' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Casualties by Region</h2>
          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Regional analysis</p>
        </div>
      </div>

      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              cornerRadius={8}
              dataKey="value"
              onMouseEnter={(_, i) => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#grad-${index})`}
                  stroke="#111827"
                  strokeWidth={index === activeIndex ? 3 : 2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl font-bold" style={{ color: '#F3F4F6' }}>{totalValue.toLocaleString()}</div>
          <div className="text-xs" style={{ color: '#9CA3AF' }}>Total casualties</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {chartData.map((d, i) => (
          <div key={d.name + i} className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs" style={{ color: '#E5E7EB' }}>{d.name}</span>
            <span className="ml-auto text-xs" style={{ color: '#9CA3AF' }}>{d.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasualtiesChart;