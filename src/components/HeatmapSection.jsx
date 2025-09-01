// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// // import { getHeatmapData } from '../services/api'; // COMMENTED OUT: Not using API for dummy data

// const HeatmapSection = ({ filters = {}, isLoading = false }) => {
//     const [mapReady, setMapReady] = useState(false);
//     const [dataLoading, setDataLoading] = useState(false);
//     const [kpData, setKpData] = useState([]);
//     const [balochistanData, setBalochistanData] = useState([]);
//     const [error, setError] = useState(null);
//     const [leafletReady, setLeafletReady] = useState(false);
    
//     const kpMapRef = useRef(null);
//     const balochistanMapRef = useRef(null);
//     const kpMapInstanceRef = useRef(null);
//     const balochistanMapInstanceRef = useRef(null);
//     const mountedRef = useRef(true);
//     const markersPlottedRef = useRef({ kp: false, balochistan: false });

//     // Check if Leaflet is available
//     useEffect(() => {
//         const checkLeaflet = () => {
//             if (typeof window !== 'undefined' && window.L) {
//                 setLeafletReady(true);
//                 console.log('Leaflet is ready');
//             } else {
//                 console.log('Leaflet not ready, checking again...');
//                 setTimeout(checkLeaflet, 100);
//             }
//         };
        
//         checkLeaflet();
//     }, []);

//     // Regional configurations
//     const regions = useMemo(() => ({
//         kp: {
//             center: [34.0151, 71.5249],
//             bounds: [[31.5, 69.0], [36.5, 75.0]],
//             zoom: 7
//         },
//         balochistan: {
//             center: [29.0, 66.0],
//             bounds: [[24.5, 61.0], [32.0, 70.5]],
//             zoom: 6
//         }
//     }), []);

//     // Create map function
//     const createMap = useCallback((container, region) => {
//         if (!container || !mountedRef.current || !window.L) {
//             console.log('Cannot create map - missing requirements');
//             return null;
//         }

//         try {
//             console.log('Creating map for region:', region);
            
//             const map = window.L.map(container, {
//                 center: region.center,
//                 zoom: region.zoom,
//                 zoomControl: true,
//                 attributionControl: false,
//                 maxBounds: region.bounds,
//                 maxBoundsViscosity: 1.0,
//                 preferCanvas: true,
//                 fadeAnimation: false,
//                 zoomAnimation: false,
//                 markerZoomAnimation: false
//             });

//             const tileLayer = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//                 attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
//                 subdomains: 'abcd',
//                 maxZoom: 15,
//                 minZoom: 5,
//                 updateWhenZooming: false,
//                 updateWhenIdle: true,
//                 keepBuffer: 4
//             });

//             tileLayer.addTo(map);
//             map.fitBounds(region.bounds, { 
//                 padding: [20, 20],
//                 animate: false 
//             });

//             console.log('Map created successfully');
//             return map;
//         } catch (error) {
//             console.error('Error creating map:', error);
//             return null;
//         }
//     }, []);

//     // Marker creation function
//     const createMarkerIcon = useCallback((point) => {
//         if (!window.L) return null;
        
//         const count = point.count || 1;
//         const size = Math.max(15, Math.min(35, count * 4));
//         const intensity = point.intensity || 0.8;
        
//         return window.L.divIcon({
//             className: 'custom-incident-marker',
//             html: `
//                 <div class="incident-marker-inner" style="
//                     width: ${size}px; 
//                     height: ${size}px; 
//                     background: rgba(255, 0, 0, ${intensity}); 
//                     border: 2px solid #dc2626; 
//                     border-radius: 50%; 
//                     display: flex; 
//                     align-items: center; 
//                     justify-content: center; 
//                     color: white; 
//                     font-size: ${Math.max(10, size - 15)}px; 
//                     font-weight: bold;
//                     box-shadow: 0 0 ${size/2}px rgba(255, 0, 0, ${intensity});
//                 ">
//                     ${count}
//                 </div>
//             `,
//             iconSize: [size, size],
//             iconAnchor: [size / 2, size / 2],
//         });
//     }, []);

//     // Initialize maps when Leaflet is ready
//     useEffect(() => {
//         if (!leafletReady) return;
        
//         const initializeMaps = () => {
//             console.log('Initializing maps...');
//             let kpMapReady = false;
//             let balochistanMapReady = false;

//             // Initialize KP map
//             if (kpMapRef.current && !kpMapInstanceRef.current && mountedRef.current) {
//                 const kpMap = createMap(kpMapRef.current, regions.kp);
//                 if (kpMap) {
//                     kpMapInstanceRef.current = kpMap;
//                     kpMapReady = true;
//                     console.log('KP map initialized');
//                 }
//             }

//             // Initialize Balochistan map
//             if (balochistanMapRef.current && !balochistanMapInstanceRef.current && mountedRef.current) {
//                 const balochistanMap = createMap(balochistanMapRef.current, regions.balochistan);
//                 if (balochistanMap) {
//                     balochistanMapInstanceRef.current = balochistanMap;
//                     balochistanMapReady = true;
//                     console.log('Balochistan map initialized');
//                 }
//             }

//             // Set maps ready when both are initialized
//             if (kpMapReady && balochistanMapReady && mountedRef.current) {
//                 setMapReady(true);
//                 console.log('Both maps ready, will fetch data next');
//             }
//         };

//         // Wait a bit for DOM elements to be ready
//         const timer = setTimeout(initializeMaps, 200);

//         return () => {
//             clearTimeout(timer);
//             if (kpMapInstanceRef.current) {
//                 try {
//                     kpMapInstanceRef.current.remove();
//                 } catch (e) {
//                     console.warn('Error removing KP map:', e);
//                 }
//                 kpMapInstanceRef.current = null;
//             }
//             if (balochistanMapInstanceRef.current) {
//                 try {
//                     balochistanMapInstanceRef.current.remove();
//                 } catch (e) {
//                     console.warn('Error removing Balochistan map:', e);
//                 }
//                 balochistanMapInstanceRef.current = null;
//             }
//         };
//     }, [leafletReady, createMap, regions]);

//     // COMMENTED OUT: Fetch data only after maps are ready
//     /*
//     useEffect(() => {
//         const fetchData = async () => {
//             if (!mapReady || dataLoading || !mountedRef.current) return;

//             console.log('Maps are ready, now fetching data...');
//             setDataLoading(true);

//             try {
//                 const [kpResponse, balochistanResponse] = await Promise.all([
//                     getHeatmapData('KHYBER_PAKHTUNKHWA', filters).catch(err => {
//                         console.error('KP data fetch failed:', err);
//                         return null;
//                     }),
//                     getHeatmapData('BALOCHISTAN', filters).catch(err => {
//                         console.error('Balochistan data fetch failed:', err);
//                         return null;
//                     })
//                 ]);

//                 if (mountedRef.current) {
//                     // Process KP data
//                     if (kpResponse?.success && kpResponse.data?.coordinates) {
//                         setKpData(kpResponse.data.coordinates);
//                         console.log('KP data loaded:', kpResponse.data.coordinates.length, 'points');
//                     } else {
//                         setKpData([]);
//                         console.warn('No KP data received');
//                     }

//                     // Process Balochistan data
//                     if (balochistanResponse?.success && balochistanResponse.data?.coordinates) {
//                         setBalochistanData(balochistanResponse.data.coordinates);
//                         console.log('Balochistan data loaded:', balochistanResponse.data.coordinates.length, 'points');
//                     } else {
//                         setBalochistanData([]);
//                         console.warn('No Balochistan data received');
//                     }

//                     setError(null);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 if (mountedRef.current) {
//                     setError('Failed to load data');
//                     setKpData([]);
//                     setBalochistanData([]);
//                 }
//             } finally {
//                 if (mountedRef.current) {
//                     setDataLoading(false);
//                 }
//             }
//         };

//         fetchData();
//     }, [mapReady, filters]);
//     */

//     // DUMMY DATA: Set dummy coordinates when maps are ready
//     useEffect(() => {
//         if (!mapReady || dataLoading || !mountedRef.current) return;

//         console.log('Maps are ready, setting dummy data...');
//         setDataLoading(true);
        
//         // Simulate API delay
//         const timer = setTimeout(() => {
//             if (mountedRef.current) {
//                 const kpDummyData = [
//                     { lat: 34.0150, lng: 71.5249, city: 'Peshawar', region: 'KHYBER_PAKHTUNKHWA', count: 5, intensity: 0.8, totalCasualties: 25 },
//                     { lat: 34.1979, lng: 72.0498, city: 'Mardan', region: 'KHYBER_PAKHTUNKHWA', count: 3, intensity: 0.7, totalCasualties: 18 },
//                     { lat: 34.1683, lng: 73.2215, city: 'Abbottabad', region: 'KHYBER_PAKHTUNKHWA', count: 2, intensity: 0.6, totalCasualties: 12 },
//                     { lat: 34.7796, lng: 72.3626, city: 'Swat', region: 'KHYBER_PAKHTUNKHWA', count: 4, intensity: 0.9, totalCasualties: 22 }
//                 ];

//                 const balochistanDummyData = [
//                     { lat: 30.1798, lng: 66.9750, city: 'Quetta', region: 'BALOCHISTAN', count: 3, intensity: 0.6, totalCasualties: 15 },
//                     { lat: 26.0023, lng: 63.0500, city: 'Turbat', region: 'BALOCHISTAN', count: 2, intensity: 0.5, totalCasualties: 8 },
//                     { lat: 25.1264, lng: 62.3225, city: 'Gwadar', region: 'BALOCHISTAN', count: 1, intensity: 0.4, totalCasualties: 5 },
//                     { lat: 27.8000, lng: 66.6167, city: 'Khuzdar', region: 'BALOCHISTAN', count: 2, intensity: 0.6, totalCasualties: 10 }
//                 ];
                
//                 setKpData(kpDummyData);
//                 setBalochistanData(balochistanDummyData);
//                 setError(null);
//                 setDataLoading(false);
//                 console.log('Dummy data loaded - KP:', kpDummyData.length, 'points, Balochistan:', balochistanDummyData.length, 'points');
//             }
//         }, 1000); // 1 second delay to simulate API call

//         return () => clearTimeout(timer);
//     }, [mapReady]);

//     // Plot markers on KP map
//     useEffect(() => {
//         if (!kpMapInstanceRef.current || !kpData.length || dataLoading || markersPlottedRef.current.kp || !window.L) return;

//         console.log('Plotting KP markers:', kpData.length, 'points');
//         const map = kpMapInstanceRef.current;

//         // Clear existing markers
//         map.eachLayer((layer) => {
//             if (layer.options?.isIncident) {
//                 map.removeLayer(layer);
//             }
//         });

//         // Add new markers
//         kpData.forEach((point, index) => {
//             if (!point.lat || !point.lng || isNaN(point.lat) || isNaN(point.lng)) {
//                 return;
//             }

//             try {
//                 const marker = window.L.marker([parseFloat(point.lat), parseFloat(point.lng)], { 
//                     icon: createMarkerIcon(point),
//                     isIncident: true
//                 }).bindPopup(`
//                     <div style="text-align: center; min-width: 120px; font-family: sans-serif;">
//                         <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 16px; color: #333;">
//                             ${point.city || 'Unknown Location'}
//                         </h3>
//                         <p style="margin: 0 0 4px 0; color: #666;">
//                             <strong>${point.count || 1}</strong> incident(s)
//                         </p>
//                         <p style="margin: 0 0 4px 0; font-size: 12px; color: #888;">
//                             Intensity: ${Math.round((point.intensity || 0.8) * 100)}%
//                         </p>
//                         <p style="margin: 0; font-size: 10px; color: #aaa;">
//                             KP Province
//                         </p>
//                     </div>
//                 `);
                
//                 marker.addTo(map);
//             } catch (markerError) {
//                 console.warn('Error creating KP marker:', markerError);
//             }
//         });

//         markersPlottedRef.current.kp = true;
//         console.log('KP markers plotted successfully');
//     }, [kpData, dataLoading, createMarkerIcon]);

//     // Plot markers on Balochistan map
//     useEffect(() => {
//         if (!balochistanMapInstanceRef.current || !balochistanData.length || dataLoading || markersPlottedRef.current.balochistan || !window.L) return;

//         console.log('Plotting Balochistan markers:', balochistanData.length, 'points');
//         const map = balochistanMapInstanceRef.current;

//         // Clear existing markers
//         map.eachLayer((layer) => {
//             if (layer.options?.isIncident) {
//                 map.removeLayer(layer);
//             }
//         });

//         // Add new markers
//         balochistanData.forEach((point, index) => {
//             if (!point.lat || !point.lng || isNaN(point.lat) || isNaN(point.lng)) {
//                 return;
//             }

//             try {
//                 const marker = window.L.marker([parseFloat(point.lat), parseFloat(point.lng)], { 
//                     icon: createMarkerIcon(point),
//                     isIncident: true
//                 }).bindPopup(`
//                     <div style="text-align: center; min-width: 120px; font-family: sans-serif;">
//                         <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 16px; color: #333;">
//                             ${point.city || 'Unknown Location'}
//                         </h3>
//                         <p style="margin: 0 0 4px 0; color: #666;">
//                             <strong>${point.count || 1}</strong> incident(s)
//                         </p>
//                         <p style="margin: 0 0 4px 0; font-size: 12px; color: #888;">
//                             Intensity: ${Math.round((point.intensity || 0.8) * 100)}%
//                         </p>
//                         <p style="margin: 0; font-size: 10px; color: #aaa;">
//                             Balochistan Province
//                         </p>
//                     </div>
//                 `);
                
//                 marker.addTo(map);
//             } catch (markerError) {
//                 console.warn('Error creating Balochistan marker:', markerError);
//             }
//         });

//         markersPlottedRef.current.balochistan = true;
//         console.log('Balochistan markers plotted successfully');
//     }, [balochistanData, dataLoading, createMarkerIcon]);

//     // Reset markers plotted flag when filters change
//     useEffect(() => {
//         markersPlottedRef.current = { kp: false, balochistan: false };
//     }, [filters]);

//     // Cleanup on unmount
//     useEffect(() => {
//         return () => {
//             mountedRef.current = false;
//         };
//     }, []);

//     // Show loading if maps are not ready
//     if (!leafletReady || !mapReady) {
//         return (
//             <div className='w-full h-full'>
//                 <div className='bg-[#262626] rounded-lg p-4 w-full h-full flex items-center justify-center'>
//                     <div className="text-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
//                         <div className="text-white text-sm">
//                             {!leafletReady ? 'Loading Leaflet...' : 'Initializing Maps...'}
//                         </div>
//                         <div className="text-gray-400 text-xs mt-1">
//                             Setting up regional views...
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const totalKpIncidents = kpData.reduce((sum, point) => sum + (point.count || 1), 0);
//     const totalBalochistanIncidents = balochistanData.reduce((sum, point) => sum + (point.count || 1), 0);

//     return (
//         <div className='w-full h-full'>
//             <div className="bg-[#262626] rounded-lg p-4 w-full h-full">
//                 <h1 className="text-white text-left text-2xl font-bold mb-4">
//                     Pakistan Terror Incidents Heatmap
//                 </h1>
                
//                 {error && (
//                     <div className="bg-yellow-900 border border-yellow-600 text-yellow-200 px-3 py-2 rounded mb-4 text-sm">
//                         Warning: {error}
//                     </div>
//                 )}
                
//                 <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 h-80">
//                     {/* KP Heatmap */}
//                     <div className="relative rounded-lg overflow-hidden border border-gray-600">
//                         <div className="absolute top-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-sm font-medium z-20">
//                             KP Heatmap
//                         </div>
//                         <div
//                             ref={kpMapRef}
//                             style={{ 
//                                 height: '100%', 
//                                 width: '100%',
//                                 backgroundColor: '#1a1a1a'
//                             }}
//                             className="z-10"
//                         />
                        
//                         {dataLoading && (
//                             <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
//                                 <div className="flex items-center space-x-1">
//                                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400"></div>
//                                     <span>Loading Data...</span>
//                                 </div>
//                             </div>
//                         )}

//                         <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
//                             {totalKpIncidents} incidents
//                         </div>
//                     </div>

//                     {/* Balochistan Heatmap */}
//                     <div className="relative rounded-lg overflow-hidden border border-gray-600">
//                         <div className="absolute top-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-sm font-medium z-20">
//                             Balochistan Heatmap
//                         </div>
//                         <div
//                             ref={balochistanMapRef}
//                             style={{ 
//                                 height: '100%', 
//                                 width: '100%',
//                                 backgroundColor: '#1a1a1a'
//                             }}
//                             className="z-10"
//                         />
                        
//                         {dataLoading && (
//                             <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
//                                 <div className="flex items-center space-x-1">
//                                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400"></div>
//                                     <span>Loading Data...</span>
//                                 </div>
//                             </div>
//                         )}

//                         <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
//                             {totalBalochistanIncidents} incidents
//                         </div>
//                     </div>
//                 </div>

//                 {/* Legend */}
//                 <div className="mt-4 flex justify-center">
//                     <div className="bg-black bg-opacity-80 px-4 py-2 rounded-lg border border-gray-600">
//                         <div className="text-white text-xs font-medium mb-2 text-center">
//                             {dataLoading ? 'Loading Data...' : 'Terror Incidents Overview'}
//                         </div>
//                         <div className="flex items-center justify-center space-x-4">
//                             <div className="flex items-center space-x-2">
//                                 <div className="w-4 h-4 bg-red-500 rounded-full opacity-80"></div>
//                                 <span className="text-gray-300 text-xs">Terror Incidents</span>
//                             </div>
//                             <div className="text-gray-400 text-xs">
//                                 Total: {totalKpIncidents + totalBalochistanIncidents} incidents
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HeatmapSection;
import React, { useState, useEffect, useRef } from 'react';
import { getHeatmapData } from '../services/api';
import L from 'leaflet';

// Import Leaflet CSS - make sure this is also imported in your main.jsx or index.js
import 'leaflet/dist/leaflet.css';

const HeatmapSection = ({ filters = {}, isLoading = false }) => {
    const [kpData, setKpData] = useState([]);
    const [balochistanData, setBalochistanData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kpMapInitialized, setKpMapInitialized] = useState(false);
    const [balochistanMapInitialized, setBalochistanMapInitialized] = useState(false);
    const [dataSource, setDataSource] = useState(''); // Track data source
    const kpMapRef = useRef(null);
    const balochistanMapRef = useRef(null);
    const kpMapInstanceRef = useRef(null);
    const balochistanMapInstanceRef = useRef(null);

    // Regional map coordinates and bounds
    const regions = {
        kp: {
            center: [34.0151, 71.5249], // Peshawar
            bounds: [[31.5, 69.0], [36.5, 75.0]], // KP province bounds
            zoom: 7
        },
        balochistan: {
            center: [29.0, 66.0], // Central Balochistan
            bounds: [[24.5, 61.0], [32.0, 70.5]], // Balochistan province bounds
            zoom: 6
        }
    };

    // Initialize KP map
    useEffect(() => {
        const initializeKpMap = () => {
            try {
                if (!kpMapRef.current || kpMapInstanceRef.current) return;

                console.log('Initializing KP map...');

                const map = L.map(kpMapRef.current, {
                    center: regions.kp.center,
                    zoom: regions.kp.zoom,
                    zoomControl: true,
                    attributionControl: false,
                    maxBounds: regions.kp.bounds,
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
                kpMapInstanceRef.current = { map, L };

                // Fit map to KP bounds
                map.fitBounds(regions.kp.bounds, { padding: [20, 20] });

                setTimeout(() => {
                    map.invalidateSize();
                    setKpMapInitialized(true);
                    console.log('KP map initialized successfully');
                }, 200);

            } catch (error) {
                console.error('Error initializing KP map:', error);
                setError('Failed to initialize KP map: ' + error.message);
            }
        };

        const timer = setTimeout(initializeKpMap, 300);
        return () => {
            clearTimeout(timer);
            if (kpMapInstanceRef.current?.map) {
                try {
                    kpMapInstanceRef.current.map.remove();
                    kpMapInstanceRef.current = null;
                    setKpMapInitialized(false);
                } catch (cleanupError) {
                    console.warn('Error during KP map cleanup:', cleanupError);
                }
            }
        };
    }, []);

    // Initialize Balochistan map
    useEffect(() => {
        const initializeBalochistanMap = () => {
            try {
                if (!balochistanMapRef.current || balochistanMapInstanceRef.current) return;

                console.log('Initializing Balochistan map...');

                const map = L.map(balochistanMapRef.current, {
                    center: regions.balochistan.center,
                    zoom: regions.balochistan.zoom,
                    zoomControl: true,
                    attributionControl: false,
                    maxBounds: regions.balochistan.bounds,
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
                balochistanMapInstanceRef.current = { map, L };

                // Fit map to Balochistan bounds
                map.fitBounds(regions.balochistan.bounds, { padding: [20, 20] });

                setTimeout(() => {
                    map.invalidateSize();
                    setBalochistanMapInitialized(true);
                    console.log('Balochistan map initialized successfully');
                }, 200);

            } catch (error) {
                console.error('Error initializing Balochistan map:', error);
                setError('Failed to initialize Balochistan map: ' + error.message);
            }
        };

        const timer = setTimeout(initializeBalochistanMap, 400);
        return () => {
            clearTimeout(timer);
            if (balochistanMapInstanceRef.current?.map) {
                try {
                    balochistanMapInstanceRef.current.map.remove();
                    balochistanMapInstanceRef.current = null;
                    setBalochistanMapInitialized(false);
                } catch (cleanupError) {
                    console.warn('Error during Balochistan map cleanup:', cleanupError);
                }
            }
        };
    }, []);

    // Update KP markers
    useEffect(() => {
        if (!kpMapInstanceRef.current || !kpMapInitialized) return;

        const { map, L } = kpMapInstanceRef.current;
        console.log('Updating KP markers, data points:', kpData.length);

        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer.options?.isIncident) {
                map.removeLayer(layer);
            }
        });

        // Add incident markers for KP
        kpData.forEach((point) => {
            if (!point.lat || !point.lng || isNaN(point.lat) || isNaN(point.lng)) {
                console.warn('Invalid coordinates for KP point:', point);
                return;
            }

            try {
                const count = point.count || 1;
                const size = Math.max(15, Math.min(35, count * 4));
                const intensity = point.intensity || 0.8;
                
                const incidentIcon = L.divIcon({
                    className: 'custom-incident-marker',
                    html: `
                        <div class="incident-marker-inner" style="
                            width: ${size}px; 
                            height: ${size}px; 
                            background: rgba(255, 0, 0, ${intensity}); 
                            border: 2px solid #dc2626; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            color: white; 
                            font-size: ${Math.max(10, size - 15)}px; 
                            font-weight: bold;
                            box-shadow: 0 0 ${size/2}px rgba(255, 0, 0, ${intensity});
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
                                Intensity: ${Math.round(intensity * 100)}%
                            </p>
                            <p style="margin: 0; font-size: 10px; color: #aaa;">
                                KP Province
                            </p>
                        </div>
                    `);

            } catch (markerError) {
                console.warn('Error adding KP marker:', markerError, point);
            }
        });

    }, [kpData, kpMapInitialized]);

    // Update Balochistan markers
    useEffect(() => {
        if (!balochistanMapInstanceRef.current || !balochistanMapInitialized) return;

        const { map, L } = balochistanMapInstanceRef.current;
        console.log('Updating Balochistan markers, data points:', balochistanData.length);

        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer.options?.isIncident) {
                map.removeLayer(layer);
            }
        });

        // Add incident markers for Balochistan
        balochistanData.forEach((point) => {
            if (!point.lat || !point.lng || isNaN(point.lat) || isNaN(point.lng)) {
                console.warn('Invalid coordinates for Balochistan point:', point);
                return;
            }

            try {
                const count = point.count || 1;
                const size = Math.max(15, Math.min(35, count * 4));
                const intensity = point.intensity || 0.8;
                
                const incidentIcon = L.divIcon({
                    className: 'custom-incident-marker',
                    html: `
                        <div class="incident-marker-inner" style="
                            width: ${size}px; 
                            height: ${size}px; 
                            background: rgba(255, 0, 0, ${intensity}); 
                            border: 2px solid #dc2626; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            color: white; 
                            font-size: ${Math.max(10, size - 15)}px; 
                            font-weight: bold;
                            box-shadow: 0 0 ${size/2}px rgba(255, 0, 0, ${intensity});
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
                                Intensity: ${Math.round(intensity * 100)}%
                            </p>
                            <p style="margin: 0; font-size: 10px; color: #aaa;">
                                Balochistan Province
                            </p>
                        </div>
                    `);

            } catch (markerError) {
                console.warn('Error adding Balochistan marker:', markerError, point);
            }
        });

    }, [balochistanData, balochistanMapInitialized]);

    // Fetch data with improved error handling and debugging
    useEffect(() => {
        const fetchHeatmapData = async () => {
            setLoading(true);
            setError(null);
            setDataSource('');
            
            try {
                console.log('Starting heatmap data fetch...');
                console.log('Filters:', filters);
                console.log('getHeatmapData function available:', typeof getHeatmapData === 'function');
                
                if (typeof getHeatmapData !== 'function') {
                    throw new Error('getHeatmapData function is not available');
                }

                console.log('Calling API for both regions...');
                
                // Make API calls with detailed logging
                const kpPromise = getHeatmapData('KHYBER_PAKHTUNKHWA')
                    .then(response => {
                        console.log('KP API Response:', response);
                        return response;
                    })
                    .catch(err => {
                        console.error('KP API Error:', err);
                        throw new Error(`KP data fetch failed: ${err.message}`);
                    });

                const balochistanPromise = getHeatmapData('BALOCHISTAN')
                    .then(response => {
                        console.log('Balochistan API Response:', response);
                        return response;
                    })
                    .catch(err => {
                        console.error('Balochistan API Error:', err);
                        throw new Error(`Balochistan data fetch failed: ${err.message}`);
                    });

                const [kpResponse, balochistanResponse] = await Promise.all([kpPromise, balochistanPromise]);

                // Process KP data with detailed validation
                let kpDataProcessed = [];
                if (kpResponse) {
                    console.log('Processing KP response structure:', Object.keys(kpResponse));
                    
                    // Try multiple response structure patterns
                    if (kpResponse?.success && kpResponse.data?.coordinates) {
                        kpDataProcessed = kpResponse.data.coordinates;
                        console.log('Used success.data.coordinates pattern for KP');
                    } else if (kpResponse?.data?.coordinates) {
                        kpDataProcessed = kpResponse.data.coordinates;
                        console.log('Used data.coordinates pattern for KP');
                    } else if (kpResponse?.coordinates) {
                        kpDataProcessed = kpResponse.coordinates;
                        console.log('Used coordinates pattern for KP');
                    } else if (Array.isArray(kpResponse?.data)) {
                        kpDataProcessed = kpResponse.data;
                        console.log('Used data array pattern for KP');
                    } else if (Array.isArray(kpResponse)) {
                        kpDataProcessed = kpResponse;
                        console.log('Used direct array pattern for KP');
                    }
                }

                // Process Balochistan data with detailed validation
                let balochistanDataProcessed = [];
                if (balochistanResponse) {
                    console.log('Processing Balochistan response structure:', Object.keys(balochistanResponse));
                    
                    // Try multiple response structure patterns
                    if (balochistanResponse?.success && balochistanResponse.data?.coordinates) {
                        balochistanDataProcessed = balochistanResponse.data.coordinates;
                        console.log('Used success.data.coordinates pattern for Balochistan');
                    } else if (balochistanResponse?.data?.coordinates) {
                        balochistanDataProcessed = balochistanResponse.data.coordinates;
                        console.log('Used data.coordinates pattern for Balochistan');
                    } else if (balochistanResponse?.coordinates) {
                        balochistanDataProcessed = balochistanResponse.coordinates;
                        console.log('Used coordinates pattern for Balochistan');
                    } else if (Array.isArray(balochistanResponse?.data)) {
                        balochistanDataProcessed = balochistanResponse.data;
                        console.log('Used data array pattern for Balochistan');
                    } else if (Array.isArray(balochistanResponse)) {
                        balochistanDataProcessed = balochistanResponse;
                        console.log('Used direct array pattern for Balochistan');
                    }
                }

                console.log('Processed KP data length:', kpDataProcessed.length);
                console.log('Processed Balochistan data length:', balochistanDataProcessed.length);

                if (kpDataProcessed.length > 0 || balochistanDataProcessed.length > 0) {
                    setKpData(kpDataProcessed);
                    setBalochistanData(balochistanDataProcessed);
                    setDataSource('API');
                    console.log('Successfully loaded data from API');
                } else {
                    throw new Error('No valid data received from API - both regions returned empty arrays');
                }

            } catch (error) {
                console.error('Complete error details:', error);
                setError(`API Error: ${error.message}`);
                
                // Use fallback data
                console.log('Using fallback mock data due to API error');
                setKpData([
                    { lat: 34.0150, lng: 71.5249, intensity: 0.8, city: 'Peshawar', count: 5 },
                    { lat: 34.1979, lng: 72.0498, intensity: 0.9, city: 'Mardan', count: 8 },
                    { lat: 34.1683, lng: 73.2215, intensity: 0.7, city: 'Abbottabad', count: 3 },
                    { lat: 35.0228, lng: 71.5789, intensity: 0.6, city: 'Chitral', count: 2 }
                ]);
                setBalochistanData([
                    { lat: 30.1798, lng: 66.9750, intensity: 0.8, city: 'Quetta', count: 6 },
                    { lat: 28.3877, lng: 65.0470, intensity: 0.9, city: 'Turbat', count: 4 },
                    { lat: 26.2442, lng: 63.9892, intensity: 0.7, city: 'Gwadar', count: 3 },
                    { lat: 29.4064, lng: 67.0822, intensity: 0.6, city: 'Khuzdar', count: 5 }
                ]);
                setDataSource('Mock (API Failed)');
            } finally {
                setLoading(false);
            }
        };

        fetchHeatmapData();
    }, [filters]);

    if (loading || isLoading) {
        return (
            <div className='w-full h-full'>
                <div className='bg-[#262626] rounded-lg p-4 w-full h-full flex items-center justify-center'>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                        <div className="text-white text-sm">Loading Pakistan Heatmaps...</div>
                        <div className="text-gray-400 text-xs mt-1">
                            Fetching data from backend...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalKpIncidents = kpData.reduce((sum, point) => sum + (point.count || 1), 0);
    const totalBalochistanIncidents = balochistanData.reduce((sum, point) => sum + (point.count || 1), 0);

    return (
        <div className='w-full h-full'>
            <div className=" rounded-lg p-4 w-full h-full">
                <h1 className="text-white text-left text-2xl font-bold mb-4">
                    Pakistan Terror Incidents Heatmap
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
                
                {/* Two column layout for regional maps */}
                <div className="grid grid-cols-2     lg:grid-cols-2 gap-4 h-80">
                    
                    {/* KP Heatmap */}
                    <div className="relative rounded-lg overflow-hidden border border-gray-600">
                        <div className="absolute top-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-sm font-medium z-20">
                            KP Heatmap
                        </div>
                        <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
                            JUNE
                        </div>
                        <div
                            ref={kpMapRef}
                            style={{ 
                                height: '100%', 
                                width: '100%',
                                backgroundColor: '#1a1a1a'
                            }}
                            className="z-10"
                        />
                        
                        {!kpMapInitialized && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-15">
                                <div className="text-white text-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto mb-1"></div>
                                    <div className="text-xs">Loading KP...</div>
                                </div>
                            </div>
                        )}

                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
                            {totalKpIncidents} incidents
                        </div>
                    </div>

                    {/* Balochistan Heatmap */}
                    <div className="relative rounded-lg overflow-hidden border border-gray-600">
                        <div className="absolute top-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-sm font-medium z-20">
                            Balochistan Heatmap
                        </div>
                        <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
                            JUNE
                        </div>
                        <div
                            ref={balochistanMapRef}
                            style={{ 
                                height: '100%', 
                                width: '100%',
                                backgroundColor: '#1a1a1a'
                            }}
                            className="z-10"
                        />
                        
                        {!balochistanMapInitialized && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-15">
                                <div className="text-white text-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto mb-1"></div>
                                    <div className="text-xs">Loading Balochistan...</div>
                                </div>
                            </div>
                        )}

                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs z-20">
                            {totalBalochistanIncidents} incidents
                        </div>
                    </div>
                </div>

                {/* Overall Legend */}
                <div className="mt-4 flex justify-center">
                    <div className="bg-black bg-opacity-80 px-4 py-2 rounded-lg border border-gray-600">
                        <div className="text-white text-xs font-medium mb-2 text-center">Legend</div>
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-red-500 rounded-full opacity-80"></div>
                                <span className="text-gray-300 text-xs">Terror Incidents</span>
                            </div>
                            <div className="text-gray-400 text-xs">
                                Total: {totalKpIncidents + totalBalochistanIncidents} incidents
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add required CSS styles */}
            <style jsx>{`
                .custom-incident-marker {
                    background: transparent !important;
                    border: none !important;
                }

                .incident-marker-inner {
                    animation: pulse-incident 2s infinite;
                }

                @keyframes pulse-incident {
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

export default HeatmapSection;