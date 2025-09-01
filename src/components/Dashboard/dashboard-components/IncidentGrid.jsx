import React from 'react';

const IncidentGrid = ({ incidents, onActionClick, pagination, onPageChange }) => {
  console.log('IncidentGrid rendered with:', { incidents: incidents?.length, onActionClick: !!onActionClick });
  
  const handleActionClick = (incident, action) => {
    console.log('IncidentGrid action clicked:', action, incident);
    if (onActionClick) {
      onActionClick(incident, action);
    } else {
      console.error('onActionClick is not defined!');
    }
  };
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

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div>
      {/* Enhanced Grid */}
      <div className="p-8">
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {incidents && incidents.length > 0 ? incidents.map((incident) => (
            <div key={incident._id} className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {getRegionAbbr(incident.region)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getSeverityColor(incident.severity)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      incident.severity === 'CRITICAL' ? 'bg-red-500' :
                      incident.severity === 'HIGH' ? 'bg-orange-500' :
                      incident.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    {incident.severity}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {incident.attackType.replace(/_/g, ' ')}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M8 7h8M8 7v3a4 4 0 004 4h4a4 4 0 004-4V7m-4 0V3a4 4 0 00-8 0v4" />
                      </svg>
                      {formatDate(incident.incidentDate)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {truncateText(incident.newsDescription)}
                </p>

                {/* Location */}
                {(incident.location?.city || incident.location?.district) && (
                  <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Location</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {incident.location?.city && `${incident.location.city}`}
                        {incident.location?.city && incident.location?.district && ', '}
                        {incident.location?.district && `${incident.location.district}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Enhanced Casualties */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-lg mr-2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Casualties</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{incident.casualties.total}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white bg-opacity-70 p-3 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-red-600 font-medium">Killed</p>
                          <p className="text-lg font-bold text-red-700">{incident.casualties.killed}</p>
                        </div>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-70 p-3 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-orange-600 font-medium">Injured</p>
                          <p className="text-lg font-bold text-orange-700">{incident.casualties.injured}</p>
                        </div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terrorist Group */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Group</p>
                      <p className="text-sm font-bold text-gray-900">
                        {incident.terroristGroup.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleActionClick(incident, 'view')}
                      className="group flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 relative z-20"
                    >
                      <svg className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => handleActionClick(incident, 'edit')}
                      className="group flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all duration-200 relative z-20"
                    >
                      <svg className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                  <button
                    onClick={() => handleActionClick(incident, 'delete')}
                    className="group flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 relative z-20"
                  >
                    <svg className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              {/* Subtle hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
            </div>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No incidents found</h3>
              <p className="text-gray-500 max-w-sm text-center mb-6 leading-relaxed">
                Try adjusting your filters or search criteria to discover more incidents in the database
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                        pageNum === pagination.currentPage
                          ? 'bg-red-600 text-white shadow-lg transform scale-105'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:scale-105'
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

export default IncidentGrid;