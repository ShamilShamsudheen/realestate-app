import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapComponent = ({ plotData ,filename}) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const navigate = useNavigate(); // Use navigate to redirect on plot click


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
        if (plotData && plotData.features && plotData.features.length > 0) {
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
                // Add index to each plot's properties
                const sanitizedPlotData = {
                    ...plotData,
                    features: plotData.features.map((feature, index) => ({
                        ...feature,
                        properties: {
                            ...feature.properties,
                            index: index // Add the plot index
                        },
                        geometry: {
                            ...feature.geometry,
                            coordinates: sanitizeCoordinates(feature.geometry.coordinates)
                        }
                    }))
                };

                // Add the data source for subplots
                map.addSource('plot-data', {
                    type: 'geojson',
                    data: sanitizedPlotData
                });

                // Add the subplot (polygon) layer
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

                // Hover effect: Change color of subplot on hover
                map.on('mouseenter', 'polygon-layer', (e) => {
                    map.getCanvas().style.cursor = 'pointer';

                    // Change color on hover
                    map.setPaintProperty('polygon-layer', 'fill-color', [
                        'case',
                        ['==', ['get', 'index'], e.features[0].properties.index],
                        '#64e336',  // Hover color
                        '#b5b3ae'  // Default color
                    ]);
                });

                // Reset color when mouse leaves the polygon
                map.on('mouseleave', 'polygon-layer', () => {
                    map.getCanvas().style.cursor = '';
                    map.setPaintProperty('polygon-layer', 'fill-color', '#b5b3ae');
                });

                // Optional: Show a popup on hover
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });

                map.on('mousemove', 'polygon-layer', (e) => {
                    const feature = e.features[0];
                    const index = feature.properties.index;

                    // Show index on hover
                    popup.setLngLat(e.lngLat)
                        .setHTML(`<strong>Plot Index: ${index}</strong>`)
                        .addTo(map);
                });

                map.on('click', 'polygon-layer', (e) => {
                    const feature = e.features[0];
                    const index = feature.properties.index;

                    // Navigate to the PlotDetails component with the index passed
                    navigate(`/plot-details/${filename}/${index}`);
                });

                map.on('mouseleave', 'polygon-layer', () => {
                    popup.remove();
                });

                // Fit the bounds to the plot data
                const bounds = new mapboxgl.LngLatBounds();
                sanitizedPlotData.features.forEach((feature) => {
                    const coords = feature.geometry.coordinates;
                    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
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
            });
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
