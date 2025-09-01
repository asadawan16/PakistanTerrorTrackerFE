import React from 'react';

const ViewDetailsModal = ({ incident, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
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

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Incident Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className=''>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Region</label>
                  <p className="text-sm text-gray-900 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getRegionAbbr(incident.region)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Attack Type</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {incident.attackType.replace(/_/g, ' ')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Terrorist Group</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {incident.terroristGroup.replace(/_/g, ' ')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Severity</label>
                  <p className="text-sm text-gray-900 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(incident.incidentDate)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Casualties</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-800">Killed</span>
                    <span className="text-2xl font-bold text-red-600">
                      {incident.casualties.killed}
                    </span>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-800">Injured</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {incident.casualties.injured}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">Total Casualties</span>
                    <span className="text-2xl font-bold text-gray-600">
                      {incident.casualties.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          {(incident.location?.city || incident.location?.district || incident.location?.coordinates) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {incident.location?.city && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="text-sm text-gray-900 mt-1">{incident.location.city}</p>
                    </div>
                  )}
                  {incident.location?.district && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">District</label>
                      <p className="text-sm text-gray-900 mt-1">{incident.location.district}</p>
                    </div>
                  )}
                  {incident.location?.coordinates && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Coordinates</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {incident.location.coordinates.latitude}, {incident.location.coordinates.longitude}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {incident.newsDescription}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incident.sourceUrl && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Source</h3>
                <a
                  href={incident.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {incident.sourceUrl}
                </a>
              </div>
            )}
            
            {incident.tags && incident.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {incident.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span> {formatDate(incident.createdAt)}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {formatDate(incident.updatedAt)}
              </div>
              <div>
                <span className="font-medium">Verified:</span> {incident.verified ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;
