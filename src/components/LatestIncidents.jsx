import React from 'react';
import { Clock, MapPin, AlertTriangle, Calendar } from 'lucide-react';

const LatestIncidents = ({ incidents = [], isLoading = false }) => {
  return (
    <div className="p-6 h-full flex flex-col" style={{ backgroundColor: '#1E2125' }}>
      <div className="mb-6">
        <h2 className="text-2xl font-normal text-white mb-2">Latest Incidents</h2>
      </div>
             
      <div className="flex-1 overflow-y-auto space-y-4 pr-2" style={{ maxHeight: '400px' }}>
        {isLoading ? (
          // Loading skeleton
          [...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-2">
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-600 rounded mb-3"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2 w-3/4"></div>
                  <div className="h-px mb-2 bg-gray-600"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          incidents.map((incident, index) => (
            <div
              key={incident.id || index}
              className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-normal leading-relaxed mb-3" style={{ color: '#FFFFFF' }}>
                    {incident.description}
                  </p>
                  <div className="text-xs flex  gap-3" style={{ color: '#9D9393' }}>
                    <div className="mb-1">{incident.date}</div>
                    <div>{incident.location}</div>
                  </div>
                  <div className="h-px my-2" style={{ backgroundColor: '#9D9393' }}></div>
                </div>
              </div>
            </div>
          ))
        )}
        {!isLoading && incidents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#242831' }}>
              <AlertTriangle className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">No recent incidents</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestIncidents;