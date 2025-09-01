import React, { useState, useEffect } from 'react';
import { incidentAPI } from '../../../services/api';

const FilterPanel = ({ filters, onFilterChange, onViewModeChange, viewMode }) => {
  const [enumValues, setEnumValues] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchEnumValues();
  }, []);

  // Keep your existing fetchEnumValues function exactly the same
  const fetchEnumValues = async () => {
    try {
      const response = await incidentAPI.getEnumValues();
      setEnumValues(response.data);
    } catch (error) {
      console.error('Error fetching enum values:', error);
    }
  };

  // Keep all your existing handler functions exactly the same
  const handleInputChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleTimeFilterChange = (timeFilter) => {
    onFilterChange({ timeFilter });
  };

  const clearFilters = () => {
    onFilterChange({
      timeFilter: 'all',
      region: '',
      attackType: '',
      terroristGroup: '',
      severity: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.region || filters.attackType || filters.terroristGroup || 
                          filters.severity || filters.search || filters.timeFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filter & Search</h2>
            <p className="text-sm text-gray-600 mt-1">Customize your incident data view</p>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <div className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-full flex items-center text-red-700 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Active Filters
              </div>
            )}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Advanced Filters
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Filter Controls */}
      <div className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Time Filter Buttons */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Time Period:</span>
            <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
              {[
                { key: 'all', label: 'All Time', icon: '∞' },
                { key: 'lastWeek', label: 'Last Week', icon: '7d' },
                { key: 'last15Days', label: 'Last 15 Days', icon: '15d' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => handleTimeFilterChange(key)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filters.timeFilter === key
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded mr-2 font-mono">
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search incidents, locations, groups..."
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 group-hover:bg-white"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {filters.search && (
                <button
                  onClick={() => handleInputChange('search', '')}
                  className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Filters</h3>
              <p className="text-sm text-gray-600">Fine-tune your search with specific criteria</p>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Region Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Region
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white transition-all duration-200"
                >
                  <option value="">All Regions</option>
                  {enumValues.regions?.map((region) => (
                    <option key={region} value={region}>
                      {region.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attack Type Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Attack Type
                </label>
                <select
                  value={filters.attackType}
                  onChange={(e) => handleInputChange('attackType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white transition-all duration-200"
                >
                  <option value="">All Types</option>
                  {enumValues.attackTypes?.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Terrorist Group Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Terrorist Group
                </label>
                <select
                  value={filters.terroristGroup}
                  onChange={(e) => handleInputChange('terroristGroup', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white transition-all duration-200"
                >
                  <option value="">All Groups</option>
                  {enumValues.terroristGroups?.map((group) => (
                    <option key={group} value={group}>
                      {group.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Severity
                </label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white transition-all duration-200"
                >
                  <option value="">All Severities</option>
                  {enumValues.severityLevels?.map((severity) => (
                    <option key={severity} value={severity}>
                      {severity}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;