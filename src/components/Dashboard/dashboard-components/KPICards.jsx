import React, { useState, useEffect } from 'react';

// Enhanced KPI Cards Component
const KPICards = ({ stats }) => {
  const { summary, regionStats } = stats;

  // Get top 3 regions by incident count
  const topRegions = regionStats
    .sort((a, b) => b.incidentCount - a.incidentCount)
    .slice(0, 3);

  const kpiCards = [
    {
      title: 'Total Incidents',
      value: summary.totalIncidents,
      change: '+12%',
      changeType: 'increase',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Total Fatalities',
      value: summary.totalKilled,
      change: '+8%',
      changeType: 'increase',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Total Injured',
      value: summary.totalInjured,
      change: '+15%',
      changeType: 'increase',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Total Casualties',
      value: summary.totalCasualties,
      change: '+11%',
      changeType: 'increase',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="mb-8">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <div key={index} className={`group relative bg-white rounded-2xl shadow-sm border ${card.borderColor} p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-3">{card.value.toLocaleString()}</p>
                <div className="flex items-center">
                  <div className={`flex items-center px-2.5 py-1 rounded-full ${card.bgColor}`}>
                    <svg className={`w-4 h-4 mr-1 ${card.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 7H7v10" />
                    </svg>
                    <span className={`text-sm font-semibold ${card.textColor}`}>
                      {card.change}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">from last period</span>
                </div>
              </div>
              <div className={`bg-gradient-to-br ${card.gradient} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">{card.icon}</div>
              </div>
            </div>
            
            {/* Animated background effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>

      {/* Enhanced Regional Breakdown */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Regional Breakdown</h3>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Top 3 Regions
          </div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRegions.map((region, index) => (
            <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 shadow-sm ${
                    index === 0 ? 'bg-gradient-to-r from-red-400 to-red-600' : 
                    index === 1 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'
                  }`}></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{region.regionAbbr}</p>
                    <p className="text-sm text-gray-600">{region.incidentCount} incidents</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  index === 0 ? 'bg-red-100 text-red-800' :
                  index === 1 ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  #{index + 1}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Casualties</span>
                <span className="text-xl font-bold text-gray-900">{region.casualties.totalCasualties}</span>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    index === 0 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                    index === 1 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'
                  }`}
                  style={{ width: `${Math.min((region.casualties.totalCasualties / Math.max(...topRegions.map(r => r.casualties.totalCasualties))) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    
  );
}; 
export default KPICards;