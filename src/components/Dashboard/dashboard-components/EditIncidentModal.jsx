import React, { useState, useEffect } from 'react';
import { incidentAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const EditIncidentModal = ({ incident, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    newsDescription: '',
    region: '',
    attackType: '',
    terroristGroup: '',
    severity: '',
    incidentDate: '',
    casualties: {
      killed: 0,
      injured: 0
    },
    location: {
      city: '',
      district: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    sourceUrl: '',
    verified: false,
    tags: []
  });
  const [enumValues, setEnumValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEnumValues();
    if (incident) {
      console.log('EditIncidentModal received incident data:', incident);
      console.log('Location data:', incident.location);
      
      const formDataToSet = {
        newsDescription: incident.newsDescription || '',
        region: incident.region || '',
        attackType: incident.attackType || '',
        terroristGroup: incident.terroristGroup || '',
        severity: incident.severity || '',
        incidentDate: incident.incidentDate ? new Date(incident.incidentDate).toISOString().split('T')[0] : '',
        casualties: {
          killed: incident.casualties?.killed || 0,
          injured: incident.casualties?.injured || 0
        },
        location: {
          city: incident.location?.city || '',
          district: incident.location?.district || '',
          coordinates: {
            latitude: incident.location?.coordinates?.latitude || '',
            longitude: incident.location?.coordinates?.longitude || ''
          }
        },
        sourceUrl: incident.sourceUrl || '',
        verified: incident.verified || false,
        tags: incident.tags || []
      };
      
      console.log('Setting form data:', formDataToSet);
      setFormData(formDataToSet);
      
      // Show success message if location data is missing

    }
  }, [incident]);

  const fetchEnumValues = async () => {
    try {
      const response = await incidentAPI.getEnumValues();
      setEnumValues(response.data);
    } catch (error) {
      console.error('Error fetching enum values:', error);
      toast.error('Failed to load form options. Please refresh the page.');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleCasualtyChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      casualties: {
        ...prev.casualties,
        [type]: parseInt(value) || 0
      }
    }));
  };

  const handleCoordinateChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          ...prev.location.coordinates,
          [type]: value
        }
      }
    }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newsDescription.trim()) {
      newErrors.newsDescription = 'News description is required';
    }
    if (!formData.region) {
      newErrors.region = 'Region is required';
    }
    if (!formData.attackType) {
      newErrors.attackType = 'Attack type is required';
    }
    if (!formData.terroristGroup) {
      newErrors.terroristGroup = 'Terrorist group is required';
    }
    if (!formData.severity) {
      newErrors.severity = 'Severity is required';
    }
    if (!formData.incidentDate) {
      newErrors.incidentDate = 'Incident date is required';
    }
    if (formData.casualties.killed < 0) {
      newErrors.killed = 'Killed count cannot be negative';
    }
    if (formData.casualties.injured < 0) {
      newErrors.injured = 'Injured count cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting.');
      return;
    }

    console.log('Submitting form data:', formData);
    console.log('Location data being submitted:', formData.location);

    setLoading(true);
    try {
      await onSave(formData);
      toast.success('Incident updated successfully!');
    } catch (error) {
      console.error('Error updating incident:', error);
      
      let errorMessage = 'Failed to update incident';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        errorMessage = `Validation errors: ${fieldErrors}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Incident</h2>
              <p className="text-sm text-gray-600 mt-1">Update incident information</p>
            </div>
                      <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  News Description *
                </label>
                <textarea
                  value={formData.newsDescription}
                  onChange={(e) => handleInputChange('newsDescription', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.newsDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={4}
                  placeholder="Enter incident description..."
                />
                {errors.newsDescription && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.newsDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.region ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Region</option>
                  {enumValues.regions?.map((region) => (
                    <option key={region} value={region}>
                      {region.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.region}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attack Type *
                </label>
                <select
                  value={formData.attackType}
                  onChange={(e) => handleInputChange('attackType', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.attackType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Attack Type</option>
                  {enumValues.attackTypes?.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                {errors.attackType && (
                  <p className="text-red-500 text-sm mt-1">{errors.attackType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terrorist Group *
                </label>
                <select
                  value={formData.terroristGroup}
                  onChange={(e) => handleInputChange('terroristGroup', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.terroristGroup ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Terrorist Group</option>
                  {enumValues.terroristGroups?.map((group) => (
                    <option key={group} value={group}>
                      {group.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                {errors.terroristGroup && (
                  <p className="text-red-500 text-sm mt-1">{errors.terroristGroup}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.severity ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Severity</option>
                  {enumValues.severityLevels?.map((severity) => (
                    <option key={severity} value={severity}>
                      {severity}
                    </option>
                  ))}
                </select>
                {errors.severity && (
                  <p className="text-red-500 text-sm mt-1">{errors.severity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Date *
                </label>
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                    errors.incidentDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.incidentDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.incidentDate}</p>
                )}
              </div>
            </div>

            {/* Casualties and Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Casualties</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Killed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.casualties.killed}
                    onChange={(e) => handleCasualtyChange('killed', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.killed ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.killed && (
                    <p className="text-red-500 text-sm mt-1">{errors.killed}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Injured
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.casualties.injured}
                    onChange={(e) => handleCasualtyChange('injured', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                      errors.injured ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.injured && (
                    <p className="text-red-500 text-sm mt-1">{errors.injured}</p>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">Location</h3>
              
              {!formData.location.city && !formData.location.district && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        <strong>Note:</strong> No location data found for this incident. You can add city and district information below.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter city name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.location.district}
                    onChange={(e) => handleLocationChange('district', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter district name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.coordinates.latitude}
                    onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter latitude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.coordinates.longitude}
                    onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter longitude"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source URL
                </label>
                <input
                  type="url"
                  value={formData.sourceUrl}
                  onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter source URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => handleInputChange('verified', e.target.checked)}
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded-lg"
                />
                <label htmlFor="verified" className="ml-3 block text-sm font-medium text-gray-900">
                  Verified Incident
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6 border-t border-gray-200 mt-8">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default EditIncidentModal;
