import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Save, AlertTriangle, Calendar, MapPin, Users, FileText, Link as LinkIcon, Tag, MapPin as LocationIcon, Hash, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { incidentAPI } from '../services/api';
import toast from 'react-hot-toast';

const schema = yup.object({
  newsDescription: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  incidentDate: yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  region: yup.string().required('Region is required'),
  attackType: yup.string().required('Attack type is required'),
  terroristGroup: yup.string().required('Terrorist group is required'),
  severity: yup.string().required('Severity is required'),
  casualties: yup.object({
    killed: yup.number().min(0, 'Killed must be 0 or greater').required('Killed count is required'),
    injured: yup.number().min(0, 'Injured must be 0 or greater').required('Injured count is required')
  }),
  location: yup.object({
    city: yup.string().trim().optional(),
    district: yup.string().trim().optional(),
    coordinates: yup.object({
      latitude: yup.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').optional(),
      longitude: yup.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').optional()
    }).optional()
  }),
  verified: yup.boolean(),
  sourceUrl: yup.string().url('Must be a valid URL').optional(),
  tags: yup.array().of(yup.string().trim())
});

const IncidentForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [enumValues, setEnumValues] = useState({
    regions: [],
    attackTypes: [],
    terroristGroups: [],
    severityLevels: []
  });
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      casualties: { killed: 0, injured: 0 },
      location: { city: '', district: '', coordinates: { latitude: '', longitude: '' } },
      verified: false,
      tags: []
    }
  });

  const watchedKilled = watch('casualties.killed') || 0;
  const watchedInjured = watch('casualties.injured') || 0;
  const totalCasualties = watchedKilled + watchedInjured;

  // Fetch enum values on component mount
  useEffect(() => {
    const fetchEnumValues = async () => {
      try {
        const response = await incidentAPI.getEnumValues();
        setEnumValues(response.data || {
          regions: ['KHYBER_PAKHTUNKHWA', 'BALOCHISTAN', 'PUNJAB', 'SINDH', 'ISLAMABAD_CAPITAL_TERRITORY', 'GILGIT_BALTISTAN', 'AZAD_KASHMIR'],
          attackTypes: ['SUICIDE_BOMBING', 'EXPLOSIVE_DEVICE', 'ARMED_ATTACK', 'KIDNAPPING', 'ASSASSINATION', 'SECTARIAN_ATTACK', 'ROCKET_ATTACK', 'GRENADE_ATTACK', 'VEHICLE_RAMMING', 'CYBER_ATTACK'],
          terroristGroups: ['TTP', 'TJP', 'HBG', 'LEJ', 'BLF', 'BLA_JEEYAND', 'BLA_AZAD', 'UBA', 'BNA', 'BRG', 'SRA', 'ISKP', 'ISPP', 'UNKNOWN', 'OTHER'],
          severityLevels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        });
      } catch (error) {
        console.error('Error fetching enum values:', error);
        toast.error('Failed to load form options');
        // Fallback enum values
        setEnumValues({
          regions: ['KHYBER_PAKHTUNKHWA', 'BALOCHISTAN', 'PUNJAB', 'SINDH', 'ISLAMABAD_CAPITAL_TERRITORY', 'GILGIT_BALTISTAN', 'AZAD_KASHMIR'],
          attackTypes: ['SUICIDE_BOMBING', 'EXPLOSIVE_DEVICE', 'ARMED_ATTACK', 'KIDNAPPING', 'ASSASSINATION', 'SECTARIAN_ATTACK', 'ROCKET_ATTACK', 'GRENADE_ATTACK', 'VEHICLE_RAMMING', 'CYBER_ATTACK'],
          terroristGroups: ['TTP', 'TJP', 'HBG', 'LEJ', 'BLF', 'BLA_JEEYAND', 'BLA_AZAD', 'UBA', 'BNA', 'BRG', 'SRA', 'ISKP', 'ISPP', 'UNKNOWN', 'OTHER'],
          severityLevels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        });
      }
    };

    fetchEnumValues();
  }, []);

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Transform data for API
      const incidentData = {
        ...data,
        incidentDate: data.incidentDate ? new Date(data.incidentDate).toISOString() : new Date().toISOString(),
        casualties: {
          ...data.casualties,
          total: totalCasualties
        },
        tags: tags, // Use the tags state
        location: {
          ...data.location,
          coordinates: {
            latitude: data.location.coordinates.latitude && data.location.coordinates.latitude !== '' ? parseFloat(data.location.coordinates.latitude) : undefined,
            longitude: data.location.coordinates.longitude && data.location.coordinates.longitude !== '' ? parseFloat(data.location.coordinates.longitude) : undefined
          }
        }
      };

      console.log('Sending incident data:', incidentData);
      const response = await incidentAPI.createIncident(incidentData);
      
      toast.success('Incident created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating incident:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to create incident';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        errorMessage = `Validation errors: ${fieldErrors}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatEnumValue = (value) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-white">Add New Incident</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-black rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Incident Description *
                </label>
                <textarea
                  {...register('newsDescription')}
                  rows={4}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Provide a detailed description of the incident..."
                />
                {errors.newsDescription && (
                  <p className="mt-1 text-sm text-red-400">{errors.newsDescription.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Incident Date *
                </label>
                <input
                  type="date"
                  {...register('incidentDate')}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {errors.incidentDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.incidentDate.message}</p>
                )}
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Region *
                </label>
                <select
                  {...register('region')}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Region</option>
                  {enumValues.regions.map((region) => (
                    <option key={region} value={region}>
                      {formatEnumValue(region)}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="mt-1 text-sm text-red-400">{errors.region.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-black rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <LocationIcon className="w-5 h-5 mr-2" />
              Location Details
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  {...register('location.city')}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter city name"
                />
                {errors.location?.city && (
                  <p className="mt-1 text-sm text-red-400">{errors.location.city.message}</p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  District
                </label>
                <input
                  type="text"
                  {...register('location.district')}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter district name"
                />
                {errors.location?.district && (
                  <p className="mt-1 text-sm text-red-400">{errors.location.district.message}</p>
                )}
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Navigation className="w-4 h-4 inline mr-2" />
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('location.coordinates.latitude', { valueAsNumber: true })}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., 34.0150"
                />
                {errors.location?.coordinates?.latitude && (
                  <p className="mt-1 text-sm text-red-400">{errors.location.coordinates.latitude.message}</p>
                )}
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Navigation className="w-4 h-4 inline mr-2" />
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('location.coordinates.longitude', { valueAsNumber: true })}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., 71.5249"
                />
                {errors.location?.coordinates?.longitude && (
                  <p className="mt-1 text-sm text-red-400">{errors.location.coordinates.longitude.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Attack Details */}
          <div className="bg-black rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Attack Details
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attack Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attack Type *
                </label>
                <select
                  {...register('attackType')}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Attack Type</option>
                  {enumValues.attackTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatEnumValue(type)}
                    </option>
                  ))}
                </select>
                {errors.attackType && (
                  <p className="mt-1 text-sm text-red-400">{errors.attackType.message}</p>
                )}
              </div>

              {/* Terrorist Group */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Terrorist Group *
                </label>
                <select
                  {...register('terroristGroup')}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Group</option>
                  {enumValues.terroristGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.terroristGroup && (
                  <p className="mt-1 text-sm text-red-400">{errors.terroristGroup.message}</p>
                )}
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Severity Level *
                </label>
                <select
                  {...register('severity')}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Severity</option>
                  {enumValues.severityLevels.map((severity) => (
                    <option key={severity} value={severity}>
                      {formatEnumValue(severity)}
                    </option>
                  ))}
                </select>
                {errors.severity && (
                  <p className="mt-1 text-sm text-red-400">{errors.severity.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Casualties */}
          <div className="bg-black rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Casualties
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Killed */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Killed
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('casualties.killed', { valueAsNumber: true })}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="0"
                />
                {errors.casualties?.killed && (
                  <p className="mt-1 text-sm text-red-400">{errors.casualties.killed.message}</p>
                )}
              </div>

              {/* Injured */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Injured
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('casualties.injured', { valueAsNumber: true })}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="0"
                />
                {errors.casualties?.injured && (
                  <p className="mt-1 text-sm text-red-400">{errors.casualties.injured.message}</p>
                )}
              </div>

              {/* Total */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Casualties
                </label>
                <div className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white">
                  <span className="text-2xl font-bold text-blue-400">{totalCasualties}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-black rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Hash className="w-5 h-5 mr-2" />
              Tags
            </h2>
            
            <div className="space-y-4">
              {/* Tag Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Add Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    className="flex-1 bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter tag and press Enter or comma"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-400">Press Enter or comma to add a tag</p>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600 text-white"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-200 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-black rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Additional Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Source URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  Source URL
                </label>
                <input
                  type="url"
                  {...register('sourceUrl')}
                  className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://example.com/news-article"
                />
                {errors.sourceUrl && (
                  <p className="mt-1 text-sm text-red-400">{errors.sourceUrl.message}</p>
                )}
              </div>

              {/* Verified */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('verified')}
                  className="w-4 h-4 text-blue-600 bg-black border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="ml-2 text-sm font-medium text-gray-300">
                  Verified Information
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting || isLoading ? 'Saving...' : 'Save Incident'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;
