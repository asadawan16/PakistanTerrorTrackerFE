import React, { useState, useEffect, useRef } from 'react';
import { getHeatmapData } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PakistanMap = ({ isLoading = false }) => {
    const [pakistanData, setPakistanData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [dataSource, setDataSource] = useState('');
    
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // Pakistan map configuration
    const pakistanConfig = {
        center: [30.3753, 69.3451],
        bounds: [[23.5, 60.0], [37.0, 75.0]],
        zoom: 6
    };

    // Initialize Pakistan map
    useEffect(() => {
        const initializeMap = () => {
            try {
                if (!mapRef.current || mapInstanceRef.current) return;

                console.log('Initializing Pakistan map...');

                const map = L.map(mapRef.current, {
                center: pakistanConfig.center,
                zoom: pakistanConfig.zoom,
                zoomControl: true,
                attributionControl: false,
                maxBounds: pakistanConfig.bounds,
                    maxBoundsViscosity: 1.0
                });

                // Add dark tile layer for better contrast
            const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 15,
                    minZoom: 5
            });

            tileLayer.addTo(map);
                mapInstanceRef.current = { map, L };

                // Fit map to Pakistan bounds
                map.fitBounds(pakistanConfig.bounds, { padding: [20, 20] });

                setTimeout(() => {
                    map.invalidateSize();
                    setMapInitialized(true);
                    console.log('Pakistan map initialized successfully');
                }, 200);

            } catch (error) {
                console.error('Error initializing Pakistan map:', error);
                setError('Failed to initialize Pakistan map: ' + error.message);
            }
        };

        const timer = setTimeout(initializeMap, 300);
        return () => {
            clearTimeout(timer);
            if (mapInstanceRef.current?.map) {
                try {
                    mapInstanceRef.current.map.remove();
                    mapInstanceRef.current = null;
                    setMapInitialized(false);
                } catch (cleanupError) {
                    console.warn('Error during Pakistan map cleanup:', cleanupError);
                }
            }
        };
    }, []);

    // Update Pakistan markers
    useEffect(() => {
        if (!mapInstanceRef.current || !mapInitialized) return;

        const { map, L } = mapInstanceRef.current;
        console.log('Updating Pakistan markers, data points:', pakistanData.length);

        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer.options?.isIncident) {
                map.removeLayer(layer);
            }
        });

        // Add incident markers for Pakistan
        pakistanData.forEach((point) => {
            if (!point.lat || !point.lng || isNaN(point.lat) || isNaN(point.lng)) {
                console.warn('Invalid coordinates for Pakistan point:', point);
                return;
            }

            try {
        const count = point.count || 1;
                const size = Math.max(15, Math.min(35, count * 4));
        const intensity = point.intensity || 0.8;
        
        // Color based on region
        const getRegionColor = (region) => {
            const colors = {
                'KHYBER_PAKHTUNKHWA': '#ef4444', // Red
                'BALOCHISTAN': '#dc2626', // Dark red
                'PUNJAB': '#f97316', // Orange
                'SINDH': '#eab308', // Yellow
                'GILGIT_BALTISTAN': '#84cc16', // Green
                'AZAD_KASHMIR': '#06b6d4', // Cyan
                'ISLAMABAD_CAPITAL_TERRITORY': '#8b5cf6' // Purple
            };
            return colors[region] || '#ef4444';
        };
        
        const color = getRegionColor(point.region);
        
                const incidentIcon = L.divIcon({
            className: 'custom-pakistan-marker',
            html: `
                <div class="pakistan-marker-inner" style="
                    width: ${size}px; 
                    height: ${size}px; 
                    background: ${color}; 
                    opacity: ${intensity};
                    border: 2px solid ${color}; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                            font-size: ${Math.max(10, size - 15)}px; 
                    font-weight: bold;
                    box-shadow: 0 0 ${size/2}px ${color}80;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">
                    ${count}
                </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
        });

                L.marker([parseFloat(point.lat), parseFloat(point.lng)], { 
                    icon: incidentIcon,
                    isIncident: true
                })
                    .addTo(map)
                    .bindPopup(`
                        <div style="text-align: center; min-width: 120px; font-family: sans-serif;">
                            <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 16px; color: #333;">
                                ${point.city || point.location || 'Unknown Location'}
                            </h3>
                            <p style="margin: 0 0 4px 0; color: #666;">
                                <strong>${count}</strong> incident(s)
                            </p>
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #888;">
                                Region: ${point.region?.replace(/_/g, ' ') || 'Unknown'}
                            </p>
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #888;">
                                Intensity: ${Math.round(intensity * 100)}%
                            </p>
                            <p style="margin: 0; font-size: 10px; color: #aaa;">
                                Pakistan
                            </p>
                        </div>
                    `);

            } catch (markerError) {
                console.warn('Error adding Pakistan marker:', markerError, point);
            }
        });

    }, [pakistanData, mapInitialized]);

    // Fetch data with improved error handling and debugging
    useEffect(() => {
        const fetchPakistanData = async () => {
            setLoading(true);
            setError(null);
            setDataSource('');
            
            try {
                console.log('Starting Pakistan data fetch...');
                console.log('getHeatmapData function available:', typeof getHeatmapData === 'function');
                
                if (typeof getHeatmapData !== 'function') {
                    throw new Error('getHeatmapData function is not available');
                }

                console.log('Calling API for all Pakistan regions...');
                
                // Fetch data for all regions in Pakistan
                const regionPromises = [
                    getHeatmapData('KHYBER_PAKHTUNKHWA', {}).then(response => {
                        console.log('KP API Response:', response);
                        return { region: 'KHYBER_PAKHTUNKHWA', response };
                    }).catch(err => {
                        console.error('KP API Error:', err);
                        return { region: 'KHYBER_PAKHTUNKHWA', response: null, error: err };
                    }),
                    
                    getHeatmapData('BALOCHISTAN', {}).then(response => {
                        console.log('Balochistan API Response:', response);
                        return { region: 'BALOCHISTAN', response };
                    }).catch(err => {
                        console.error('Balochistan API Error:', err);
                        return { region: 'BALOCHISTAN', response: null, error: err };
                    }),
                    
                    getHeatmapData('PUNJAB', {}).then(response => {
                        console.log('Punjab API Response:', response);
                        return { region: 'PUNJAB', response };
                    }).catch(err => {
                        console.error('Punjab API Error:', err);
                        return { region: 'PUNJAB', response: null, error: err };
                    }),
                    
                    getHeatmapData('SINDH', {}).then(response => {
                        console.log('Sindh API Response:', response);
                        return { region: 'SINDH', response };
                    }).catch(err => {
                        console.error('Sindh API Error:', err);
                        return { region: 'SINDH', response: null, error: err };
                    })
                ];

                const regionResults = await Promise.all(regionPromises);
                console.log('All region results:', regionResults);

                // Process all regional data
                let allProcessedData = [];
                
                regionResults.forEach(({ region, response, error }) => {
                    if (response && !error) {
                        let regionData = [];
                        
                        // Try multiple response structure patterns
                        if (response?.success && response.data?.coordinates) {
                            regionData = response.data.coordinates;
                            console.log(`Used success.data.coordinates pattern for ${region}`);
                        } else if (response?.data?.coordinates) {
                            regionData = response.data.coordinates;
                            console.log(`Used data.coordinates pattern for ${region}`);
                        } else if (response?.coordinates) {
                            regionData = response.coordinates;
                            console.log(`Used coordinates pattern for ${region}`);
                        } else if (Array.isArray(response?.data)) {
                            regionData = response.data;
                            console.log(`Used data array pattern for ${region}`);
                        } else if (Array.isArray(response)) {
                            regionData = response;
                            console.log(`Used direct array pattern for ${region}`);
                        }
                        
                        // Add region info to each data point if not present
                        const enrichedData = regionData.map(point => ({
                            ...point,
                            region: point.region || region
                        }));
                        
                        allProcessedData = [...allProcessedData, ...enrichedData];
                        console.log(`Processed ${enrichedData.length} points for ${region}`);
                    } else {
                        console.warn(`No data for ${region}:`, error?.message || 'No response');
                    }
                });

                console.log('Total processed Pakistan data length:', allProcessedData.length);
                
                if (allProcessedData.length > 0) {
                    setPakistanData(allProcessedData);
                    setDataSource('API');
                    console.log('Successfully loaded Pakistan data from API');
                } else {
                    throw new Error('No valid data received from any Pakistan region APIs');
                }
                
            } catch (error) {
                console.error('Complete error details:', error);
                setError(`API Error: ${error.message}`);
                    
                    // Use fallback data
                console.log('Using fallback mock data due to API error');
                setPakistanData([
                    { lat: 34.0150, lng: 71.5249, intensity: 0.8, city: 'Peshawar', region: 'KHYBER_PAKHTUNKHWA', count: 5 },
                    { lat: 30.1798, lng: 66.9750, intensity: 0.8, city: 'Quetta', region: 'BALOCHISTAN', count: 3 },
                    { lat: 31.5204, lng: 74.3587, intensity: 0.7, city: 'Lahore', region: 'PUNJAB', count: 4 },
                    { lat: 24.8607, lng: 67.0011, intensity: 0.9, city: 'Karachi', region: 'SINDH', count: 6 },
                    { lat: 35.9208, lng: 74.3144, intensity: 0.5, city: 'Gilgit', region: 'GILGIT_BALTISTAN', count: 2 },
                    { lat: 34.3700, lng: 73.4711, intensity: 0.4, city: 'Muzaffarabad', region: 'AZAD_KASHMIR', count: 1 },
                    { lat: 33.6844, lng: 73.0479, intensity: 0.6, city: 'Islamabad', region: 'ISLAMABAD_CAPITAL_TERRITORY', count: 2 },
                    { lat: 34.1979, lng: 72.0498, intensity: 0.7, city: 'Mardan', region: 'KHYBER_PAKHTUNKHWA', count: 3 },
                    { lat: 26.0023, lng: 63.0500, intensity: 0.5, city: 'Turbat', region: 'BALOCHISTAN', count: 2 },
                    { lat: 32.1574, lng: 74.1754, intensity: 0.6, city: 'Gujranwala', region: 'PUNJAB', count: 3 }
                ]);
                    setDataSource('Mock (API Failed)');
            } finally {
                    setLoading(false);
            }
        };

        fetchPakistanData();
    }, []);

    if (loading || isLoading) {
        return (
            <div className='w-full h-full'>
                <div className='bg-[#262626] rounded-lg p-4 w-full h-full flex items-center justify-center'>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                        <div className="text-white text-sm">Loading Pakistan Map...</div>
                        <div className="text-gray-400 text-xs mt-1">
                            Fetching data from backend...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalIncidents = pakistanData.reduce((sum, point) => sum + (point.count || 1), 0);

    return (
        <div className='w-full h-full'>
            <div className="  p-4 w-full h-full">
                <h1 className="text-white text-left text-2xl font-bold mb-4">
                    Pakistan Terror Incidents Map
                </h1>
            
            {/* Data Source Indicator */}
            <div className="mb-2 flex justify-between items-center">
                
                {error && (
                    <div className="text-red-400 text-xs">
                        Check console for details
                    </div>
                )}
            </div>
            
            {error && (
                <div className="bg-red-900 border border-red-600 text-red-200 px-3 py-2 rounded mb-4 text-sm">
                    {error}
                </div>
            )}
            
                <div className="relative rounded-lg overflow-hidden border border-gray-600 h-96">
                <div
                    ref={mapRef}
                    style={{ 
                        height: '100%', 
                        width: '100%',
                        backgroundColor: '#1a1a1a'
                    }}
                    className="z-10"
                />

                    {!mapInitialized && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-15">
                            <div className="text-white text-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto mb-1"></div>
                                <div className="text-xs">Loading Map...</div>
                        </div>
                    </div>
                )}

                {/* Region Legend */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-90 px-3 py-2 rounded text-white text-xs z-20">
                    <div className="font-medium mb-1">Regions</div>
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>KP</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>Punjab</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Sindh</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>GB</span>
                        </div>
                    </div>
                </div>

                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
                        {totalIncidents} incidents
                    </div>

                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
                    Click markers for details
                    </div>
                </div>
            </div>

            {/* Add required CSS styles */}
            <style jsx>{`
                .custom-pakistan-marker {
                    background: transparent !important;
                    border: none !important;
                }

                .pakistan-marker-inner {
                    animation: pulse-pakistan 2s infinite;
                }

                @keyframes pulse-pakistan {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                /* Override Leaflet styles for dark theme */
                .leaflet-container {
                    background: #1a1a1a !important;
                }
                
                .leaflet-control-zoom a {
                    background-color: rgba(0, 0, 0, 0.8) !important;
                    color: white !important;
                }

                .leaflet-control-zoom a:hover {
                    background-color: rgba(0, 0, 0, 0.9) !important;
                }

                .leaflet-popup-content-wrapper {
                    background: white;
                    border-radius: 8px;
                }

                .leaflet-popup-tip {
                    background: white;
                }
            `}</style>
        </div>
    );
};

export default PakistanMap;