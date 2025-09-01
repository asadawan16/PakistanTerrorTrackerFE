import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Incident API calls
export const incidentAPI = {
  // Get all incidents with filters
  getAllIncidents: (params = {}) => {
    return api.get('/incidents', { params });
  },

  // Get paginated incidents with enhanced filtering
  getPaginatedIncidents: (params = {}) => {
    return api.get('/incidents/paginated', { params });
  },

  // Get KPI statistics with time filters
  getKPIStats: (params = {}) => {
    return api.get('/incidents/kpi-stats', { params });
  },

  // Get incident by ID
  getIncidentById: (id) => {
    return api.get(`/incidents/${id}`);
  },

  // Create new incident
  createIncident: (data) => {
    return api.post('/incidents', data);
  },

  // Update incident
  updateIncident: (id, data) => {
    return api.put(`/incidents/${id}`, data);
  },

  // Delete incident
  deleteIncident: (id) => {
    return api.delete(`/incidents/${id}`);
  },

  // Get enum values
  getEnumValues: () => {
    return api.get('/incidents/enums');
  },

  // Bulk delete incidents
  bulkDeleteIncidents: (ids) => {
    return api.delete('/incidents', { data: { ids } });
  },
};

// Statistics API calls
export const statsAPI = {
  // Get dashboard statistics
  getDashboardStats: (params = {}) => {
    return api.get('/stats/dashboard', { params });
  },

  // Get regional analysis
  getRegionalAnalysis: (region, params = {}) => {
    return api.get(`/stats/regional/${region}`, { params });
  },

  // Get comparative statistics
  getComparativeStats: (params = {}) => {
    return api.get('/stats/comparative', { params });
  },

  // Get time series data
  getTimeSeriesData: (params = {}) => {
    return api.get('/stats/timeseries', { params });
  },

  // Get heatmap data for specific region
  getHeatmapData: (region, params = {}) => {
    return api.get(`/stats/heatmap/${region}`, { params });
  },

  // Get all Pakistan heatmap data
  getAllPakistanHeatmapData: (params = {}) => {
    return api.get('/stats/heatmap-pakistan/all', { params });
  },

  // Get available dates for date filter
  getAvailableDates: () => {
    return api.get('/stats/available-dates');
  },
};

// Individual API functions for direct use
export const getHeatmapData = (region, params = {}) => {
  return api.get(`/stats/heatmap/${region}`, { params });
};

export const getDashboardStats = (params = {}) => {
  return api.get('/stats/dashboard', { params });
};

// Health check
export const healthAPI = {
  checkHealth: () => {
    return api.get('/health');
  },
};

export default api;
