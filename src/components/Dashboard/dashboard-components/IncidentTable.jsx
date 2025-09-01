import React from 'react';

const IncidentTable = ({ incidents, onActionClick, pagination, onPageChange }) => {
  // Keep all your existing utility functions exactly the same
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      CRITICAL: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRegionAbbr = (region) => {
    const abbreviations = {
      'KHYBER_PAKHTUNKHWA': 'KP',
      'PUNJAB': 'PUNJAB',
      'SINDH': 'SINDH',
      'BALOCHISTAN': 'BALOCHISTAN',
      'GILGIT_BALTISTAN': 'GB',
      'AZAD_KASHMIR': 'AJK',
      'ISLAMABAD_CAPITAL_TERRITORY': 'ICT'
    };
    return abbreviations[region] || region;
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="overflow-hidden">
      {/* Enhanced Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="group px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Incident Details
                </div>
              </th>
              <th className="group px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Region
                </div>
              </th>
              <th className="group px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Attack Type
                </div>
              </th>
              <th className="group px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Casualties
                </div>
              </th>
              <th className="group px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Severity
                </div>
              </th>
              <th className="group px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M8 7h8M8 7v3a4 4 0 004 4h4a4 4 0 004-4V7m-4 0V3a4 4 0 00-8 0v4" />
                  </svg>
                  Date
                </div>
              </th>
              <th className="group px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {incidents && incidents.length > 0 ? incidents.map((incident, index) => (
              <tr key={incident._id} className={`group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-6 py-5">
                  <div className="max-w-xs">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2 leading-relaxed">
                          {truncateText(incident.newsDescription, 80)}
                        </p>
                        {(incident.location?.city || incident.location?.district) && (
                          <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-fit">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {incident.location?.city && `${incident.location.city}`}
                            {incident.location?.city && incident.location?.district && ', '}
                            {incident.location?.district && `${incident.location.district}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    {getRegionAbbr(incident.region)}
                  </span>
                </td>
                
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {incident.attackType.replace(/_/g, ' ')}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-red-50 px-2 py-1 rounded-md">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold text-red-700">
                          {incident.casualties.killed}
                        </span>
                        <span className="text-xs text-red-600 ml-1">killed</span>
                      </div>
                      <div className="flex items-center bg-orange-50 px-2 py-1 rounded-md">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-sm font-semibold text-orange-700">
                          {incident.casualties.injured}
                        </span>
                        <span className="text-xs text-orange-600 ml-1">injured</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md w-fit">
                      Total: {incident.casualties.total} casualties
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getSeverityColor(incident.severity)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      incident.severity === 'CRITICAL' ? 'bg-red-500' :
                      incident.severity === 'HIGH' ? 'bg-orange-500' :
                      incident.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    {incident.severity}
                  </span>
                </td>
                
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M8 7h8M8 7v3a4 4 0 004 4h4a4 4 0 004-4V7m-4 0V3a4 4 0 00-8 0v4" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(incident.incidentDate)}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onActionClick(incident, 'view')}
                      className="group flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      title="View Details"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onActionClick(incident, 'edit')}
                      className="group flex items-center justify-center w-8 h-8 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onActionClick(incident, 'delete')}
                      className="group flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No incidents found</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      Try adjusting your filters or search criteria to find more incidents
                    </p>
                    <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium">
                      Reset Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span>
              <span className="text-gray-500 mx-1">of</span>
              <span className="font-medium text-gray-900">{pagination.totalItems}</span>
              <span className="text-gray-500 ml-1">results</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              {/* Enhanced Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                        pageNum === pagination.currentPage
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pagination.totalPages > 5 && (
                  <span className="px-2 text-gray-500 font-medium">...</span>
                )}
              </div>
              
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentTable;