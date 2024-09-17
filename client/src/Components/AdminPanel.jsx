import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileUpload } from './FileUpload';
import MapComponent from './MapComponent';

export const AdminPanel = () => {
    const [plotData, setPlotData] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false); // For upload modal
    const [showMapModal, setShowMapModal] = useState(false); // For map modal
    const [selectedPlot, setSelectedPlot] = useState(null); // For storing selected plot data

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}admin/data`);
                
                const files = response.data.files || [];
                setPlotData(files);  // Set plot data
            } catch (error) {
                console.error('Error fetching plot data:', error.message);
            }
        };

        fetchPlots();
    }, []);

    const handleUploadComplete = (data) => {
        setPlotData((prevPlots) => [...prevPlots, data]);
        setShowUploadModal(false); // Close modal after upload completes
    };

    const handleViewClick = (file) => {
        setSelectedPlot(file.content); // Set the selected plot data for the map
        setShowMapModal(true); // Show the map modal
    };

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Admin Dashboard</h1>

            {/* Add Plot Button */}
            <div className="mb-6 flex justify-between items-center">
                <button 
                    onClick={() => setShowUploadModal(true)} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Plot
                </button>
            </div>

            {/* Table structure for plot data */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-left">Plot File Name</th>
                            <th className="px-4 py-2 border-b text-left">Status</th>
                            <th className="px-4 py-2 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plotData.map((file, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 border-b">{file.filename}</td>
                                <td className="px-4 py-2 border-b">Status Placeholder</td> {/* Replace with real status */}
                                <td className="px-4 py-2 border-b">
                                    <button 
                                        onClick={() => handleViewClick(file)} 
                                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded mr-2">
                                        View
                                    </button>
                                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for adding a new plot */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">Upload Plot File</h2>
                        <FileUpload onUploadComplete={handleUploadComplete} />
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={() => setShowUploadModal(false)} 
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for showing map with selected plot */}
            {showMapModal && selectedPlot && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 h-2/3">
                        <h2 className="text-2xl font-semibold mb-4">Plot Map</h2>
                        <div className="h-96">
                            <MapComponent plotData={selectedPlot} />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={() => setShowMapModal(false)} 
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
