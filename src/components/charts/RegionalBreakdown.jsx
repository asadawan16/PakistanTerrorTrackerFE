import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RegionalBreakdown = ({ data = [], isLoading = false }) => {
  // Fallback data if no data provided
  const chartData = data.length > 0 ? data : [
    { name: 'KP', value: 190, color: '#f97316' },
    { name: 'Balochistan', value: 184, color: '#ef4444' },
    { name: 'Sindh', value: 114, color: '#eab308' },
    { name: 'Punjab', value: 71, color: '#22c55e' }
  ];

  if (isLoading) {
    return (
      <div className="border border-gray-800 rounded-lg p-6" style={{ backgroundColor: '#262626' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Regional Breakdown</h2>
          <div className="text-sm text-gray-400">Attack Distribution</div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-800 rounded-lg p-6" style={{ backgroundColor: '#262626' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Regional Breakdown</h2>
        <div className="text-sm text-gray-400">Attack Distribution</div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationDuration={2000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1C1E21" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                color: '#374151',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#6B7280', fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={50}
              wrapperStyle={{
                paddingTop: '20px',
                color: '#374151'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-300 font-medium">
        Attacks by province
      </div>
    </div>
  );
};

export default RegionalBreakdown;