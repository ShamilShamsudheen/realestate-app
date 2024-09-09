import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';

export const UserPanel = () => {
    const [plotData, setPlotData] = useState(null); // Use null instead of empty array

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                const response = await axios.get('http://localhost:3001/user/api/geojson');
                
                // Ensure response.data is a valid GeoJSON object
                if (response.data && response.data.type === 'FeatureCollection') {
                    setPlotData(response.data);
                } else {
                    console.error('Invalid GeoJSON data received');
                }
            } catch (error) {
                console.error('Error fetching plot data:', error);
            }
        };
        
        fetchPlots();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Left div */}
            <div className="lg:w-1/4 w-full bg-gray-200 p-4 overflow-auto">
                <h1 className="text-xl font-bold mb-4">User Panel</h1>
                {/* Add more content here for the left panel */}
                <p>This is the left panel content.</p>
            </div>

            {/* Right div */}
            <div className="lg:w-3/4 w-full h-200">
                {plotData ? (
                    <MapComponent plotData={plotData} />
                ) : (
                    <p>Loading map data...</p>
                )}
            </div>
        </div>
    );
};
