import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';

const baseUrl = process.env.REACT_APP_API_URL;

export const UserPanel = () => {
    const [plotData, setPlotData] = useState(null); // The currently displayed plot data
    const [plotFiles, setPlotFiles] = useState([]); // List of plot files

    useEffect(() => {
        const fetchPlotFiles = async () => {
            try {
                const response = await axios.get(`${baseUrl}user/api/geojson-files`);
                console.log(response.data.files);

                if (response.data && Array.isArray(response.data.files)) {
                    setPlotFiles(response.data.files); // Store the file names
                } else {
                    console.error('Invalid data received for plot files');
                }
            } catch (error) {
                console.error('Error fetching plot file names:', error);
            }
        };

        fetchPlotFiles();
    }, []);

    const handleFileClick = async (filename) => {
        try {
            const response = await axios.get(`${baseUrl}user/api/geojson/${filename}`); // Fetch the specific file data
            console.log(response.data);

            // Ensure response.data is a valid GeoJSON object
            if (response.data && response.data.type === 'FeatureCollection') {
                setPlotData(response.data); // Update the plot data for map display
            } else {
                console.error('Invalid GeoJSON data received');
            }
        } catch (error) {
            console.error('Error fetching plot data for file:', error);
        }
    };

    return (
        <div>
        <div className='text-center h-56 mx-auto'>
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">User Dashboard</h1>
        </div>
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Left div - File list */}
            <div className="lg:w-1/4 w-full bg-gray-200 p-4 overflow-auto">
                <h1 className="text-xl font-bold mb-4">Plot Files</h1>
                <ul>
                    {plotFiles.length > 0 ? (
                        plotFiles.map((file, index) => (
                            <li 
                                key={index} 
                                className="cursor-pointer text-blue-600 hover:text-blue-800 mb-2"
                                onClick={() => handleFileClick(file.filename)}
                            >
                                {file.filename}
                            </li>
                        ))
                    ) : (
                        <p>No plot files available.</p>
                    )}
                </ul>
            </div>

            {/* Right div - Map view */}
            <div className="lg:w-3/4 w-full h-full">
                {plotData ? (
                    <MapComponent plotData={plotData} /> // Show the selected plot data
                ) : (
                    <p className="text-center mt-10">Select a plot file to view its map</p> // Default message
                )}
            </div>
        </div>
        </div>
    );
};
