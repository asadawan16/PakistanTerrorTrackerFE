import React from 'react';

const DeleteConfirmModal = ({ incident, onClose, onConfirm }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Delete Incident</h2>
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
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Are you sure?</h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone. This will permanently delete the incident.
              </p>
            </div>
          </div>

          {/* Incident Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Incident Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Description:</span>
                <span className="text-gray-900 font-medium text-right ">
                  {truncateText(incident.newsDescription, 60)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Region:</span>
                <span className="text-gray-900 font-medium">
                  {getRegionAbbr(incident.region)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Attack Type:</span>
                <span className="text-gray-900 font-medium">
                  {incident.attackType.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(incident.incidentDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Casualties:</span>
                <span className="text-gray-900 font-medium">
                  {incident.casualties.total} total
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Deleting this incident will remove all associated data including casualties, location details, and metadata. This action is irreversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Incident
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
