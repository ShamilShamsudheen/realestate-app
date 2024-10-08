import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';
import ClipLoader from 'react-spinners/ClipLoader';

const baseUrl = process.env.REACT_APP_API_URL;

export const UserPanel = () => {
    const [plotData, setPlotData] = useState(null); // The currently displayed plot data
    const [plotFiles, setPlotFiles] = useState([]); // List of plot files
    const [selectFileName, setSelectFileName] = useState('')
    const [subPlotIndices, setSubPlotIndices] = useState([]); // Indices of subplots
    const [loadingFiles, setLoadingFiles] = useState(false); // Loading state for file list
    const [loadingPlot, setLoadingPlot] = useState(false); // Loading state for plot data
    const [minTimeSpinner, setMinTimeSpinner] = useState(false); // State to handle spinner visibility for a fixed time

    useEffect(() => {
        const fetchPlotFiles = async () => {
            setLoadingFiles(true); // Start loading for plot files
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
            } finally {
                setTimeout(() => {
                    setLoadingFiles(false); // End loading after minimum time
                }, 2000); // Set a minimum 2-second delay
            }
        };

        fetchPlotFiles();
    }, []);

    const handleFileClick = async (filename) => {
        setLoadingPlot(true); // Start loading for plot data
        setMinTimeSpinner(true); // Trigger spinner with time delay

        // Ensure spinner shows for a minimum time (e.g., 2 seconds)
        setTimeout(() => {
            setMinTimeSpinner(false); // Stop the spinner after 2 seconds
        }, 2000); // Minimum spinner time in milliseconds

        try {
            const response = await axios.get(`${baseUrl}user/api/geojson/${filename}`);
            console.log(response.data);

            if (response.data && response.data.type === 'FeatureCollection') {
                setPlotData(response.data);
                setSelectFileName(filename);

                const indices = response.data.features.map((feature, index) => ({
                    name: feature.properties.name || `Unnamed Plot ${index + 1}`,
                    index: index,
                }));

                setSubPlotIndices(indices);
            } else {
                console.error('Invalid GeoJSON data received');
            }
        } catch (error) {
            console.error('Error fetching plot data for file:', error);
        } finally {
            setTimeout(() => {
                setLoadingPlot(false); // Ensure the spinner shows for at least 2 seconds
            }, 1000); // Adjust the time delay as needed
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
                    {loadingFiles || minTimeSpinner ? ( // Show spinner while loading file list or during time delay
                        <div className="flex justify-center">
                            <ClipLoader color="#4A90E2" size={50} />
                        </div>
                    ) : (
                        <ul>
                            {plotFiles.length > 0 ? (
                                plotFiles.map((file, index) => (
                                    <li 
                                        key={index} 
                                        className="cursor-pointer text-blue-600 hover:text-blue-800 mb-2"
                                        onClick={() => handleFileClick(file.filename)}
                                    >
                                        {file.geometry}
                                        {file.filename}
                                    </li>
                                ))
                            ) : (
                                <p>No plot files available.</p>
                            )}
                        </ul>
                    )}
                </div>

                {/* Right div - Map view */}
                <div className="lg:w-3/4 w-full h-full p-4">
                    {loadingPlot || minTimeSpinner ? ( // Show spinner while loading plot data or during time delay
                        <div className="flex justify-center items-center h-full">
                            <ClipLoader color="#4A90E2" size={100} />
                        </div>
                    ) : plotData ? (
                        <>
                            <MapComponent plotData={plotData} filename={selectFileName} />
                            {/* <div className="mt-4">
                                <h2 className="text-xl font-bold">Subplots:</h2>
                                <ul>
                                    {subPlotIndices.length > 0 ? (
                                        subPlotIndices.map((subplot, idx) => (
                                            <li key={idx} className="text-gray-700 mb-1">
                                                <strong>{subplot.name}</strong> (Index: {subplot.index})
                                            </li>
                                        ))
                                    ) : (
                                        <p>No subplots available for this plot.</p>
                                    )}
                                </ul>
                            </div> */}
                        </>
                    ) : (
                        <p className="text-center mt-10">Select a plot file to view its map and subplots</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPanel;
