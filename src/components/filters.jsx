import React, { useState, useEffect } from 'react';
import { Filter, X, Calendar, TrendingUp, Download, ChevronDown } from 'lucide-react';
import { statsAPI } from '../services/api';
import { Link } from 'react-router-dom';
const FiltersComponent = ({ 
  filters = {},
  handleFilterChange,
  applyFilters,
  clearFilters,
  hasActiveFilters = false,
  compareDates,
  generateReport 
}) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch available dates on component mount
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await statsAPI.getAvailableDates();
        if (response?.success) {
          setAvailableDates(response.data?.availableDates || []);
        }
      } catch (error) {
        console.error('Error fetching available dates:', error);
      }
    };

    fetchAvailableDates();
  }, []);

  const handleLocalFilterChange = (key, value) => {
    console.log('Filter change:', key, value);
    if (handleFilterChange) {
      handleFilterChange(key, value);
    }
  };

  const currentFilters = filters || {};
  console.log('Current filters in component:', currentFilters);

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Check if date has incidents
  const hasIncidents = (date) => {
    // Format date as YYYY-MM-DD without timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return availableDates.some(d => d.date === dateString);
  };

  // Get incident count for date
  const getIncidentCount = (date) => {
    // Format date as YYYY-MM-DD without timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const dateData = availableDates.find(d => d.date === dateString);
    return dateData ? dateData.count : 0;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    // Format date as YYYY-MM-DD without timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log('Date clicked:', dateString);
    console.log('Has incidents:', hasIncidents(date));
    console.log('Available dates:', availableDates);
    
    if (hasIncidents(date)) {
      console.log('Setting date filter:', dateString);
      handleLocalFilterChange('startDate', dateString);
      handleLocalFilterChange('endDate', dateString);
      setShowDatePicker(false);
      
      // Force immediate filter application
      if (applyFilters) {
        setTimeout(() => applyFilters(), 100);
      }
    } else {
      console.log('No incidents on this date');
    }
  };

  // Check if a date is currently selected
  const isDateSelected = (date) => {
    if (!currentFilters.startDate) return false;
    
    // Format both dates as YYYY-MM-DD for comparison
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const currentDateString = `${year}-${month}-${day}`;
    
    return currentDateString === currentFilters.startDate;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      {/* Filter Button */}
      <div className='px-3 py-2 border-2 border-gray-600 bg-[#202126]'>
        <button 
          onClick={applyFilters || (() => console.log('Apply filters'))}
          className="flex items-center px-3 border transition-all duration-200 hover:opacity-80"
          style={{ backgroundColor: '#5B65F5', borderColor: '#5B65F5', color: '#FFFFFF' }}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium cursor-pointer">Apply Filters</span>
        </button>
      </div>

      {/* Date Input */}
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center px-3 py-2 border text-gray-300 text-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: '#202126', borderColor: '#525866' }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          <span className={currentFilters.startDate ? 'text-white font-medium' : 'text-gray-400'}>
            {formatDateForDisplay(currentFilters.startDate)}
          </span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>
        
        {showDatePicker && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-[#202126] border border-gray-600 rounded-md shadow-lg z-50">
            <div className="p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="text-gray-400 hover:text-white p-1"
                >
                  ←
                </button>
                <h3 className="text-white font-medium">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={goToNextMonth}
                  className="text-gray-400 hover:text-white p-1"
                >
                  →
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs text-gray-400 p-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const hasData = hasIncidents(date);
                  const incidentCount = getIncidentCount(date);
                  const isSelected = isDateSelected(date);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(date)}
                      disabled={!hasData}
                      className={`
                        p-2 text-xs rounded-md transition-colors relative
                        ${isCurrentMonth 
                          ? hasData 
                            ? isSelected
                              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer border-2 border-blue-400' 
                              : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer border-2 border-red-400'
                            : 'text-gray-600 cursor-not-allowed bg-gray-800'
                          : 'text-gray-700 cursor-not-allowed bg-gray-900'
                        }
                        ${isToday && !isSelected ? 'ring-1 ring-gray-400' : ''}
                      `}
                      title={hasData ? `${date.toLocaleDateString()}: ${incidentCount} incident(s)` : 'No incidents on this date'}
                    >
                      <div className="font-medium">{date.getDate()}</div>
                      {hasData && (
                        <div className="text-xs opacity-90 font-bold">{incidentCount}</div>
                      )}
                      {hasData && !isSelected && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded mr-1 border border-red-400"></div>
                    <span>Has incidents</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded mr-1 border border-blue-400"></div>
                    <span>Selected date</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-800 rounded mr-1"></div>
                    <span>No data</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                    <span>Incident indicator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Region Dropdown */}
      <div className="relative">
        <select 
          value={currentFilters.region || ''}
          onChange={(e) => handleLocalFilterChange('region', e.target.value)}
          className="appearance-none px-3 py-2 pr-8 border text-gray-300 text-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: '#202126', borderColor: '#525866' }}
        >
          <option value="">All Region</option>
          <option value="KHYBER_PAKHTUNKHWA">Khyber Pakhtunkhwa</option>
          <option value="BALOCHISTAN">Balochistan</option>
          <option value="PUNJAB">Punjab</option>
          <option value="SINDH">Sindh</option>
          <option value="ISLAMABAD_CAPITAL_TERRITORY">Islamabad Capital Territory</option>
          <option value="GILGIT_BALTISTAN">Gilgit-Baltistan</option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Attack Type Dropdown */}
      <div className="relative">
        <select 
          value={currentFilters.attackType || ''}
          onChange={(e) => handleLocalFilterChange('attackType', e.target.value)}
          className="appearance-none px-3 py-2 pr-8 border text-gray-300 text-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: '#202126', borderColor: '#525866' }}
        >
          <option value="">Attack Type</option>
          <option value="SUICIDE_BOMBING">Suicide Bombing</option>
          <option value="EXPLOSIVE_DEVICE">IED Explosion</option>
          <option value="ARMED_ATTACK">Armed Attack</option>
          <option value="KIDNAPPING">Kidnapping</option>
          <option value="SECTARIAN_ATTACK">Sectarian Attack</option>
          <option value="ROCKET_ATTACK">Rocket Attack</option>
          <option value="GRENADE_ATTACK">Grenade Attack</option>
          <option value="VEHICLE_RAMMING">Vehicle Ramming</option>
          <option value="CYBER_ATTACK">Cyber Attack</option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Group Dropdown */}
      <div className="relative">
        <select 
          value={currentFilters.group || ''}
          onChange={(e) => handleLocalFilterChange('group', e.target.value)}
          className="appearance-none px-3 py-2 pr-8 border text-gray-300 text-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: '#202126', borderColor: '#525866' }}
        >
          <option value="">Group</option>
          <option value="TTP">TTP</option>
          <option value="TJP">TJP</option>
          <option value="HBG">HBG</option>
          <option value="LEJ">LeJ</option>
          <option value="BLF">BLF</option>
          <option value="BLA_JEEYAND">BLA Jeeyand</option>
          <option value="BLA_AZAD">BLA Azad</option>
          <option value="UBA">UBA</option>
          <option value="BNA">BNA</option>
          <option value="BRG">BRG</option>
          <option value="SRA">SRA</option>
          <option value="ISKP">ISKP</option>
          <option value="ISPP">ISPP</option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Severity Dropdown */}
      <div className="relative">
        <select 
          value={currentFilters.severity || ''}
          onChange={(e) => handleLocalFilterChange('severity', e.target.value)}
          className="appearance-none px-3 py-2 pr-8 border text-gray-300 text-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: '#202126', borderColor: '#525866' }}
        >
          <option value="">Severity</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={compareDates || (() => console.log('Compare dates'))}
          className="flex items-center px-3 py-2 border text-gray-300 text-sm hover:opacity-80 transition-all duration-200"
          style={{ backgroundColor: '#202126', borderColor: '#525866' }}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Compare Dates
        </button>

        <button 
          onClick={generateReport || (() => console.log('Generate report'))}
          className="flex items-center px-3 py-2 border text-gray-300 text-sm hover:opacity-80 transition-all duration-200"
          style={{ backgroundColor: '#202126', borderColor: '#525866' }}
        >
          <Download className="w-4 h-4 mr-1" />
          Generate Report
        </button>
        <Link to="/dashboard"  className="flex items-center px-3 py-2 border text-gray-300 text-sm hover:opacity-80 transition-all duration-200"
          style={{ backgroundColor: '#202126', borderColor: '#525866' }}
        >
         View  Dashboard
        </Link>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters || (() => console.log('Clear filters'))}
            className="flex items-center px-3 py-2 border text-gray-300 text-sm hover:opacity-80 transition-all duration-200"
            style={{ backgroundColor: '#202126', borderColor: '#525866' }}
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Close dropdowns when clicking outside */}
      {showDatePicker ? (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDatePicker(false)}
        />
      ) : null}
    </div>
  );
};

export default FiltersComponent;