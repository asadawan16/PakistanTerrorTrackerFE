import { useEffect, useState } from "react";
import { incidentAPI } from "../../services/api";
import toast from 'react-hot-toast';
import KPICards from "./dashboard-components/KPICards";
import FilterPanel from "./dashboard-components/FilterPanel";
import IncidentTable from "./dashboard-components/IncidentTable";
import ViewDetailsModal from "./dashboard-components/ViewDetailsModal";
import DeleteConfirmModal from "./dashboard-components/DeleteConfirmModal";
import EditIncidentModal from "./dashboard-components/EditIncidentModal";
import IncidentGrid from "./dashboard-components/IncidentGrid";
import logo from "../../assets/logo.png";
// Enhanced Dashboard Component
const Dashboard2 = () => {
  // State for incidents and pagination
  const [incidents, setIncidents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // State for KPI statistics
  const [kpiStats, setKpiStats] = useState({
    summary: {
      totalIncidents: 0,
      totalKilled: 0,
      totalInjured: 0,
      totalCasualties: 0
    },
    regionStats: []
  });

  // State for filters
  const [filters, setFilters] = useState({
    timeFilter: 'all',
    region: '',
    attackType: '',
    terroristGroup: '',
    severity: '',
    search: ''
  });

  // State for view mode (table/grid)
  const [viewMode, setViewMode] = useState('table');

  // State for modals
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'delete'

  // State for loading
  const [loading, setLoading] = useState(true);
  const [loadingIncidents, setLoadingIncidents] = useState(false);

  // Keep all your existing data fetching functions exactly the same
  const fetchKPIStats = async () => {
    try {
      const response = await incidentAPI.getKPIStats({ timeFilter: filters.timeFilter });
      if (response?.data) {
        setKpiStats(response.data);
      } else {
        console.warn('No KPI stats data received');
        setKpiStats({
          summary: {
            totalIncidents: 0,
            totalKilled: 0,
            totalInjured: 0,
            totalCasualties: 0
          },
          regionStats: []
        });
        toast.warning('KPI statistics data is incomplete');
      }
    } catch (error) {
      console.error('Error fetching KPI stats:', error);
      setKpiStats({
        summary: {
          totalIncidents: 0,
          totalKilled: 0,
          totalInjured: 0,
          totalCasualties: 0
        },
        regionStats: []
      });
      toast.error('Failed to load KPI statistics');
    }
  };

  const fetchIncidents = async (page = 1) => {
    setLoadingIncidents(true);
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage,
        ...filters
      };

      const response = await incidentAPI.getPaginatedIncidents(params);
      console.log('API Response:', response);
      
      if (response?.data?.incidents) {
        console.log('Incidents found:', response.data.incidents.length);
        console.log('First incident data:', response.data.incidents[0]);
        console.log('First incident location:', response.data.incidents[0]?.location);
        setIncidents(response.data.incidents);
        setPagination(response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: response.data.incidents.length,
          itemsPerPage: pagination.itemsPerPage,
          hasNextPage: false,
          hasPrevPage: false
        });
        
        
      } else {
        console.warn('No incidents data received');
        console.log('Response structure:', response);
        setIncidents([]);
        setPagination({
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: pagination.itemsPerPage,
          hasNextPage: false,
          hasPrevPage: false
        });
     
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setIncidents([]);
      setPagination({
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: pagination.itemsPerPage,
        hasNextPage: false,
        hasPrevPage: false
      });
      
      toast.error('Failed to load incidents. Please try again.');
    } finally {
      setLoadingIncidents(false);
    }
  };

  // Keep all your existing handler functions exactly the same
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    

  };

  const handlePageChange = (page) => {

    fetchIncidents(page);
  };

  const handleViewModeChange = (mode) => {
    console.log('View mode changed to:', mode);
    setViewMode(mode);
    toast.success(`Switched to ${mode === 'table' ? 'Table' : 'Grid'} view`);
  };

  const handleActionClick = (incident, action) => {
    console.log('Action clicked:', action, 'for incident:', incident);
    console.log('Incident location data:', incident.location);
    setSelectedIncident(incident);
    setModalType(action);
    
    // Show toast for action
    const actionNames = {
      'view': 'Viewing incident details',
      'edit': 'Opening incident for editing',
      'delete': 'Confirming incident deletion'
    };
  };

  const handleModalClose = () => {
    setSelectedIncident(null);
    setModalType(null);
  };

  const handleIncidentSave = async (updatedData) => {
    try {
      await incidentAPI.updateIncident(selectedIncident._id, updatedData);
      toast.success('Incident updated successfully!');
      handleModalClose();
      fetchIncidents(pagination.currentPage);
      fetchKPIStats();
    } catch (error) {
      console.error('Error updating incident:', error);
      throw error;
    }
  };

  const handleIncidentDelete = async () => {
    try {
      await incidentAPI.deleteIncident(selectedIncident._id);
      toast.success('Incident deleted successfully!');
      handleModalClose();
      fetchIncidents(pagination.currentPage);
      fetchKPIStats();
    } catch (error) {
      console.error('Error deleting incident:', error);
      
      let errorMessage = 'Failed to delete incident';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  // Keep all your existing useEffect hooks exactly the same
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchKPIStats(),
        fetchIncidents(1)
      ]);
      setLoading(false);
      toast.success('Dashboard loaded successfully!');
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchKPIStats();
      fetchIncidents(1);
    }
  }, [filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 mx-auto absolute inset-0"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Fetching latest incident data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <div  >
                <h1 className="text-4xl flex gap-4 font-bold text-gray-900 ">
                  <img src={logo} alt="logo" className="w-12 h-12" /> 
                  Pakistan Terror Tracker
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl">
                  Comprehensive overview of terrorist incidents and security statistics across Pakistan
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} onViewModeChange={handleViewModeChange} viewMode={viewMode} />
        <KPICards stats={kpiStats} />

        {/* Enhanced Filter Panel Placeholder */}
   
        {/* Enhanced View Mode Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">View Mode:</span>
            <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
              <button
                onClick={() => handleViewModeChange('table')}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white text-red-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
                </svg>
                Table View
              </button>
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-red-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid View
              </button>
            </div>
          </div>

          {loadingIncidents && (
            <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-200">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600 mr-2"></div>
              <span className="text-sm font-medium">Loading incidents...</span>
            </div>
          )}
        </div>

        {/* Enhanced Incidents Display Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {viewMode === 'table' ? 'Incidents Table' : 'Incidents Grid'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {pagination.totalItems} total incidents found
            </p>
          </div>
          
          <div className="p-6">
            {incidents && incidents.length > 0 ? (
              viewMode === 'table' ? 
                <IncidentTable incidents={incidents} onActionClick={handleActionClick} pagination={pagination} onPageChange={handlePageChange} /> : 
                <IncidentGrid incidents={incidents} onActionClick={handleActionClick} pagination={pagination} onPageChange={handlePageChange} />
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No incidents found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Try adjusting your filters or search criteria to find more incidents
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Placeholders - Keep your existing modal logic */}
        {modalType === 'view' && selectedIncident && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl  w-full">
              <div className="p-6">
                <ViewDetailsModal incident={selectedIncident} onClose={handleModalClose} />
                <button onClick={handleModalClose} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {modalType === 'edit' && selectedIncident && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full">
              <div className="p-6">
                <EditIncidentModal incident={selectedIncident} onClose={handleModalClose} onSave={handleIncidentSave} />
                <button onClick={handleModalClose} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {modalType === 'delete' && selectedIncident && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <DeleteConfirmModal incident={selectedIncident} onClose={handleModalClose} onConfirm={handleIncidentDelete} />
                <button onClick={handleModalClose} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
  export default Dashboard2;