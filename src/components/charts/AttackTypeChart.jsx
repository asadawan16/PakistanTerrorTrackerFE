import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

const AttackTypeChart = ({ data = [], isLoading = false }) => {
  // Color palette for different groups
  const colorPalette = [
    '#FFC107', '#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', 
    '#85C1E9', '#F8C471', '#A8E6CF', '#FF8B94', '#96CEB4'
  ];

  // Helper function to get color for each group
  const getGroupColor = (groupName) => {
    const groupColors = {
      'TTP': '#FFC107',
      'TJP': '#FF6B35', 
      'HBG': '#4ECDC4',
      'LEJ': '#45B7D1',
      'BLF': '#96CEB4',
      'BLA': '#FFEAA7',
      'UBA': '#DDA0DD',
      'BNA': '#98D8C8',
      'BRG': '#F7DC6F',
      'SRA': '#BB8FCE',
      'ISKP': '#85C1E9',
      'ISPP': '#F8C471'
    };
    return groupColors[groupName] || colorPalette[Math.floor(Math.random() * colorPalette.length)];
  };

  // Transform data to include fill property
  const chartData = data.map(item => ({
    ...item,
    fill: getGroupColor(item.name)
  }));

  // Fallback data if no data provided
  const displayData = chartData.length > 0 ? chartData : [
    { name: 'TTP', value: 147, fill: '#FFC107' },
    { name: 'TJP', value: 89, fill: '#FF6B35' },
    { name: 'HBG', value: 67, fill: '#4ECDC4' },
    { name: 'LEJ', value: 45, fill: '#45B7D1' },
    { name: 'BLF', value: 34, fill: '#96CEB4' }
  ];

  if (isLoading) {
    return (
      <div className="border border-gray-800 rounded-lg p-6" style={{ backgroundColor: '#262626' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Attack Types by Group</h2>
          <div className="text-sm text-gray-400">Group Analysis</div>
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
        <h2 className="text-xl font-bold text-white">Attack Types by Group</h2>
        <div className="text-sm text-gray-400">Group Analysis</div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={[0, 'dataMax + 10']}
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
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
            <Bar 
              dataKey="value" 
              radius={[2, 2, 0, 0]}
              animationDuration={2000}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-300 font-medium">
        Total attacks claimed by terrorist groups
      </div>
    </div>
  );
};

export default AttackTypeChart;