// import React, { useEffect, useRef } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { handleGeoJsonData } from '../Constant/Constant.js';

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// const MapComponent = ({ plotData }) => {
//     const mapContainerRef = useRef(null);
//     const mapRef = useRef(null);

//     useEffect(() => {
//         if (plotData && plotData.features && plotData.features.length > 0) {
//             // Convert coordinates
//             const convertedData = handleGeoJsonData(plotData.features);

//             console.log('Converted Data:', convertedData); // Debugging log

//             // Initialize the map
//             mapRef.current = new mapboxgl.Map({
//                 container: mapContainerRef.current,
//                 style: 'mapbox://styles/mapbox/streets-v12',
//                 pitch: 45,
//                 bearing: -17.6,
//             });

//             mapRef.current.on('load', () => {
//                 try {
//                     // Add data source
//                     mapRef.current.addSource('plot-data', {
//                         type: 'geojson',
//                         data: {
//                             type: 'FeatureCollection',
//                             features: convertedData
//                         }
//                     });

//                     // Add layers for different geometry types
//                     mapRef.current.addLayer({
//                         id: 'polygon-fill',
//                         type: 'fill',
//                         source: 'plot-data',
//                         paint: {
//                             'fill-color': '#888888',
//                             'fill-opacity': 0.4
//                         },
//                         filter: ['==', '$type', 'Polygon']
//                     });

//                     mapRef.current.addLayer({
//                         id: 'polygon-line',
//                         type: 'line',
//                         source: 'plot-data',
//                         paint: {
//                             'line-width': 2,
//                             'line-color': '#4264fb'
//                         },
//                         filter: ['==', '$type', 'Polygon']
//                     });

//                     mapRef.current.addLayer({
//                         id: 'line-layer',
//                         type: 'line',
//                         source: 'plot-data',
//                         paint: {
//                             'line-width': 2,
//                             'line-color': '#ff69b4'
//                         },
//                         filter: ['==', '$type', 'LineString']
//                     });

//                     mapRef.current.addLayer({
//                         id: 'point-layer',
//                         type: 'circle',
//                         source: 'plot-data',
//                         paint: {
//                             'circle-radius': 6,
//                             'circle-color': '#ff4500'
//                         },
//                         filter: ['==', '$type', 'Point']
//                     });

//                     // Calculate bounds and fit the map
//                     const bounds = new mapboxgl.LngLatBounds();

//                     convertedData.forEach((feature) => {
//                         let coords = feature.geometry.coordinates;

//                         if (feature.geometry.type === 'Point') {
//                             bounds.extend(coords);
//                         } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'Polygon') {
//                             coords.forEach(coord => bounds.extend(coord));
//                         } else if (feature.geometry.type === 'MultiLineString' || feature.geometry.type === 'MultiPolygon') {
//                             coords.flat(1).forEach(coord => bounds.extend(coord));
//                         }
//                     });

//                     if (bounds.isEmpty()) {
//                         console.error('Bounds calculation failed: No valid coordinates found.');
//                     } else {
//                         mapRef.current.fitBounds(bounds, {
//                             padding: 10,
//                             maxZoom: 16
//                         });
//                     }

//                 } catch (error) {
//                     console.error('Error adding source or layer:', error);
//                 }
//             });
//         }

//         return () => {
//             if (mapRef.current) {
//                 mapRef.current.remove();
//             }
//         };
//     }, [plotData]);

//     return (
//         <div
//             style={{ height: '100%' }}
//             ref={mapContainerRef}
//             className="map-container"
//         />
//     );
// };

// export default MapComponent;
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapComponent = ({ plotData }) => {
    // console.log(plotData,"plotdata");
    
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const sanitizeCoordinates = (coordinates) => {
        return coordinates.map(coord => {
            if (Array.isArray(coord[0])) {
                return sanitizeCoordinates(coord);
            } else {
                const sanitizedLat = isNaN(coord[1]) ? 0 : Math.max(-90, Math.min(90, coord[1]));
                const sanitizedLng = isNaN(coord[0]) ? 0 : Math.max(-180, Math.min(180, coord[0]));
                return [sanitizedLng, sanitizedLat];
            }
        });
    };
    
      useEffect(() => {
        const dataToUse = plotData;
        
        if (dataToUse && dataToUse.features && dataToUse.features.length > 0) {
            if (!mapRef.current) {
                mapRef.current = new mapboxgl.Map({
                    container: mapContainerRef.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    pitch: 45,
                    bearing: -17.6,
                    center: [0, 0],
                    zoom: 2
                });
            }
    
            const map = mapRef.current;
    
            map.on('load', () => {
                try {
                    const sanitizedPlotData = {
                        ...dataToUse,
                        features: dataToUse.features.map(feature => ({
                            ...feature,
                            geometry: {
                                ...feature.geometry,
                                coordinates: sanitizeCoordinates(feature.geometry.coordinates)
                            }
                        }))
                    };
    
                    map.addSource('plot-data', {
                        type: 'geojson',
                        data: sanitizedPlotData
                    });
    
                    map.addLayer({
                        id: 'point-layer',
                        type: 'circle',
                        source: 'plot-data',
                        paint: {
                            'circle-radius': 6,
                            'circle-color': '#ff4500'
                        },
                        filter: ['==', '$type', 'Point']
                    });
    
                    map.addLayer({
                        id: 'line-layer',
                        type: 'line',
                        source: 'plot-data',
                        paint: {
                            'line-color': '#4a4443',
                            'line-width': 1
                        },
                        filter: ['in', '$type', 'LineString']
                    });
    
                    map.addLayer({
                        id: 'polygon-layer',
                        type: 'fill',
                        source: 'plot-data',
                        paint: {
                            'fill-color': '#b5b3ae',
                            'fill-opacity': 0.8,
                            'fill-outline-color': '#000000'
                        },
                        filter: ['in', '$type', 'Polygon']
                    });
    
                    const bounds = new mapboxgl.LngLatBounds();
                    sanitizedPlotData.features.forEach((feature) => {
                        let coords = feature.geometry.coordinates;
                        if (feature.geometry.type === 'Point') {
                            bounds.extend(coords);
                        } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'Polygon') {
                            coords.forEach(coord => bounds.extend(coord));
                        } else if (feature.geometry.type === 'MultiLineString' || feature.geometry.type === 'MultiPolygon') {
                            coords.flat(1).forEach(coord => bounds.extend(coord));
                        }
                    });
    
                    if (!bounds.isEmpty()) {
                        map.fitBounds(bounds, {
                            padding: 10,
                            maxZoom: 16
                        });
                    } else {
                        console.error('Bounds calculation failed: No valid coordinates found.');
                    }
    
                } catch (error) {
                    console.error('Error adding source or layer:', error);
                }
            });
    
        } else {
            console.warn('No plot data available or plot data has no features.');
        }
    
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [plotData]);
    

    return (
        <div
            style={{ height: '100%' }}
            ref={mapContainerRef}
            className="map-container"
        />
    );
};

export default MapComponent;
