// import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Convert Web Mercator coordinates to Latitude/Longitude
const webMercatorToLatLng = ([x, y]) => {
    const lng = (x / 20037508.34) * 180;
    let lat = (y / 20037508.34) * 180;
    lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
    return [lng, lat];
};

// Function to handle GeoJSON data and convert coordinates
export const handleGeoJsonData = (features) => {
    return features.map(feature => {
        let coordinates;
        switch (feature.geometry.type) {
            case 'Point':
                coordinates = webMercatorToLatLng(feature.geometry.coordinates);
                break;
            case 'Polygon':
            case 'MultiPolygon':
                coordinates = feature.geometry.coordinates.map(ring =>
                    ring.map(coord => webMercatorToLatLng(coord))
                );
                break;
            case 'LineString':
            case 'MultiLineString':
                coordinates = feature.geometry.coordinates.map(coord => webMercatorToLatLng(coord));
                break;
            default:
                console.warn(`Unsupported geometry type: ${feature.geometry.type}`);
                return null;
        }
        return {
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates
            }
        };
    }).filter(Boolean); // Filter out null values
};