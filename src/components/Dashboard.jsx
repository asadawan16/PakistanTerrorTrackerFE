import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BarChart3, Map, Settings, Shield } from 'lucide-react';
import Header from './Header';
import StatisticsCards from './StatisticsCards';
import FiltersComponent from './filters';
import MonthlyTrends from './charts/MonthlyTrends';
import AttackTypeChart from './charts/AttackTypeChart';
import RegionalBreakdown from './charts/RegionalBreakdown';
import CasualtiesChart from './charts/CasualtiesChart';
import PakistanMap from './PakistanMap';
import HeatmapSection from './HeatmapSection';
import LatestIncidents from './LatestIncidents';
import Footer from './Footer';
import { statsAPI, incidentAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  // Component-specific data states
  const [latestIncidents, setLatestIncidents] = useState([]);
  const [attackTypeData, setAttackTypeData] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [casualtiesData, setCasualtiesData] = useState([]);
  const [monthlyTrendsData, setMonthlyTrendsData] = useState([]);

  // Fetch latest incidents
  const fetchLatestIncidents = async (filterParams = {}) => {
    try {
      const response = await incidentAPI.getAllIncidents({
        ...filterParams,
        page: 1,
        limit: 5,
        sortBy: 'incidentDate',
        sortOrder: 'desc'
      });
      
      if (response?.success) {
        // Transform incidents to match component expectations
        const transformedIncidents = response.data.map(incident => {
          // Handle location data properly
          let locationDisplay = 'Unknown Location';
          if (incident.location && incident.location.city && incident.location.district) {
            locationDisplay = `${incident.location.city}, ${incident.location.district}`;
          } else if (incident.location && incident.location.city) {
            locationDisplay = incident.location.city;
          } else if (incident.location && incident.location.district) {
            locationDisplay = incident.location.district;
          } else if (incident.region) {
            locationDisplay = formatRegionName(incident.region);
          }

          return {
            id: incident._id,
            description: incident.newsDescription || `${incident.attackType} attack in ${locationDisplay}`,
            date: new Date(incident.incidentDate).toLocaleDateString('en-GB'), // DD/MM/YYYY format
            location: locationDisplay,
            region: incident.region,
            attackType: incident.attackType,
            casualties: incident.casualties
          };
        });
        setLatestIncidents(transformedIncidents);
      } else {
        console.warn('No latest incidents received');
        setLatestIncidents([]);
      }
    } catch (error) {
      console.error('Error fetching latest incidents:', error);
      setLatestIncidents([]);
    }
  };

  // Helper functions for colors
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
    return groupColors[groupName] || '#FFC107';
  };

  const getRegionColor = (regionName) => {
    const regionColors = {
      'KHYBER_PAKHTUNKHWA': '#f97316',
      'BALOCHISTAN': '#ef4444',
      'SINDH': '#eab308',
      'PUNJAB': '#22c55e',
      'GILGIT_BALTISTAN': '#06b6d4',
      'AZAD_KASHMIR': '#8b5cf6',
      'ISLAMABAD_CAPITAL_TERRITORY': '#84cc16'
    };
    return regionColors[regionName] || '#f97316';
  };

  // Helper function to format region names to shorter prefixes
  const formatRegionName = (regionName) => {
    const regionMapping = {
      'KHYBER_PAKHTUNKHWA': 'KPK',
      'BALOCHISTAN': 'Balochistan',
      'SINDH': 'Sindh',
      'PUNJAB': 'Punjab',
      'GILGIT_BALTISTAN': 'GB',
      'AZAD_KASHMIR': 'AJK',
      'ISLAMABAD_CAPITAL_TERRITORY': 'ICT'
    };
    return regionMapping[regionName] || regionName;
  };

  // Fetch all component data
  const fetchAllComponentData = async (filterParams = {}) => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats first (contains most of the data we need)
      const dashboardResponse = await statsAPI.getDashboardStats(filterParams);
      
      if (dashboardResponse?.success) {
        // Update dashboard data
        setDashboardData(dashboardResponse.data || {});
        
        // Transform and set chart data from dashboard response
        const data = dashboardResponse.data;
        
        // Transform group stats for attack type chart
        const groupStats = data?.groupStats || [];
        const attackTypeData = groupStats.map(group => ({
          name: group._id || 'Unknown',
          value: group.count || 0,
          fill: getGroupColor(group._id)
        }));
        setAttackTypeData(attackTypeData);
        
        // Transform region stats for regional breakdown
        const regionStats = data?.regionStats || [];
        const regionalData = regionStats.map(region => ({
          name: formatRegionName(region._id) || 'Unknown',
          value: region.count || 0,
          color: getRegionColor(region._id)
        }));
        setRegionalData(regionalData);
        
        // Transform region stats for casualties chart
        const casualtiesData = regionStats.map(region => ({
          name: formatRegionName(region._id) || 'Unknown',
          value: region.totalCasualties || 0,
          color: getRegionColor(region._id)
        }));
        setCasualtiesData(casualtiesData);
        
        // Transform monthly trends
        const monthlyTrends = data?.monthlyTrends || [];
        const monthlyData = monthlyTrends.map(trend => ({
          month: trend.month,
          attacks: trend.count || 0,
          casualties: trend.totalCasualties || 0,
          normalizedAttacks: Math.min((trend.count || 0) / 100, 1),
          normalizedCasualties: Math.min((trend.totalCasualties || 0) / 200, 1)
        }));
        setMonthlyTrendsData(monthlyData);
      }
      
      // Fetch latest incidents separately
      await fetchLatestIncidents(filterParams);
      
    } catch (error) {
      console.error('Error fetching component data:', error);
      toast.error('Failed to load some dashboard components');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Check if there are any active filters
    const hasFilters = Object.values(newFilters).some(val => val && val !== '');
    setHasActiveFilters(hasFilters);
  };

  // Apply filters
  const applyFilters = () => {
    fetchAllComponentData(filters);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setHasActiveFilters(false);
    fetchAllComponentData({});
  };

  // Compare dates
  const compareDates = () => {
    toast.info('Date comparison feature coming soon');
  };

  // Generate report
  const generateReport = () => {
    toast.info('Report generation feature coming soon');
  };

  // Fetch initial data
  useEffect(() => {
    fetchAllComponentData();
  }, []);

    return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Section */}
        <div className="mb-6">
          <FiltersComponent
            filters={filters}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            compareDates={compareDates}
            generateReport={generateReport}
          />
        </div>

            <div className='grid grid-cols-5 lg:grid-cols-3 gap-6 mb-6'>
        <div className='col-span-1'>

            <LatestIncidents incidents={latestIncidents} isLoading={loading} />
        </div>

            <StatisticsCards data={dashboardData} isLoading={loading} />
             <div className='col-span-3'>

              <PakistanMap isLoading={false} />
             </div>
            </div>
        <div className='grid grid-cols-4 lg:grid-cols-3 gap-6 mb-6'>
        <div className='col-span-2'>

          <AttackTypeChart data={attackTypeData} isLoading={loading} />
        </div>
      
          <div className='col-span-1'>

          <CasualtiesChart data={casualtiesData} isLoading={loading} />
          </div>
          
          <div className='col-span-1'>

          {/* Regional Breakdown Pie Chart */}
          <RegionalBreakdown data={regionalData} isLoading={loading} />
          </div>
        </div>
        <div className='my-6'>

            <MonthlyTrends  data={monthlyTrendsData} filters={filters} isLoading={loading} />
        </div>
                  <HeatmapSection filters={filters} isLoading={false} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
