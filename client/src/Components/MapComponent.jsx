import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapComponent = ({ plotData }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(76.683);
    const [lat, setLat] = useState(8.956);
    const [zoom, setZoom] = useState(16);

    useEffect(() => {
        if (plotData && plotData.features && plotData.features.length > 0 && !map.current) {
            // Initialize the map only once plotData is available
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });

            map.current.on('load', () => {
                console.log(plotData, "plotData in MapComponent");

                map.current.addSource('plots', {
                    type: 'geojson',
                    data: plotData
                });

                map.current.addLayer({
                    id: 'plot-lines',
                    type: 'line',
                    source: 'plots',
                    layout: {},
                    paint: {
                        'line-color': '#007cbf',
                        'line-width': 3
                    }
                });
            });
        }
    }, [plotData]);

    return (
        <div>
            {plotData && plotData.features && plotData.features.length > 0 ? (
                <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '96vh' }} />
            ) : (
                <p>Loading map data...</p>
            )}
        </div>
    );
};

export default MapComponent;
    