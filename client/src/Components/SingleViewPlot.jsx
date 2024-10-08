import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MapboxGL from 'mapbox-gl'; // Import Mapbox GL

const baseUrl = process.env.REACT_APP_API_URL;

const SingleViewPlot = () => {
    const { filename, index } = useParams(); // Get the filename and index from the URL parameters
    const [coordinates, setCoordinates] = useState(null); // State to hold coordinates
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchPlotDetails = async () => {
            try {
                // Fetch the plot details from the API using the filename and index
                const { data } = await axios.get(`${baseUrl}admin/plots/${filename}/${index}`);
                console.log(data); // To inspect the fetched data

                // Extract the coordinates, removing the altitude (third value) if present
                if (data && data.geometry && data.geometry.coordinates) {
                    const plotCoordinates = data.geometry.coordinates.map(coordSet => 
                        coordSet.map(coord => [coord[0], coord[1]]) // Extract only [longitude, latitude]
                    );
                    setCoordinates(plotCoordinates); // Store the 2D coordinates in state
                } else {
                    throw new Error('No valid coordinates found in the response.');
                }
            } catch (err) {
                setError('Error fetching plot coordinates.'); // Handle API errors
            } finally {
                setLoading(false); // Stop loading after the API call
            }
        };

        fetchPlotDetails(); // Call the API when the component mounts
    }, [filename, index]);

    useEffect(() => {
        if (coordinates) {
            MapboxGL.accessToken = process.env.REACT_APP_MAPBOX_TOKEN; // Set the Mapbox token

            const map = new MapboxGL.Map({
                container: 'map', // ID of the div where the map will be rendered
                style: 'mapbox://styles/mapbox/streets-v11', // Mapbox style
                center: [coordinates[0][0][0], coordinates[0][0][1]], // Use the first [longitude, latitude] pair to center the map
                zoom: 18 // Set an appropriate zoom level
            });

            // Add the plot coordinates as a GeoJSON source and display them
            map.on('load', () => {
                map.addSource('plot', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon', // Assuming it's a polygon, adjust this if necessary
                            coordinates: coordinates
                        }
                    }
                });

                // Add a fill layer to represent the plot with green color
                map.addLayer({
                    id: 'plot-fill',
                    type: 'fill',
                    source: 'plot',
                    paint: {
                        'fill-color': '#00FF00', // Green color for the fill
                        'fill-opacity': 0.5 // Semi-transparent fill
                    }
                });

                // Add an outline layer for the plot with red color
                map.addLayer({
                    id: 'plot-outline',
                    type: 'line',
                    source: 'plot',
                    paint: {
                        'line-color': '#FF0000', // Red color for the boundary
                        'line-width': 2 // Line thickness
                    }
                });
            });

            // Cleanup map when the component unmounts
            return () => map.remove();
        }
    }, [coordinates]);

    if (loading) {
        return <div>Loading map...</div>; // Show a loading message while the map is being loaded
    }

    if (error) {
        return <div className="text-red-500">{error}</div>; // Show an error message if something goes wrong
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Single Plot View</h2>
            <div id="map" className="w-full h-96"></div> {/* Container for the Mapbox map */}
        </div>
    );
};

export default SingleViewPlot;
